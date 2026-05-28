const express = require('express')
const router = express.Router()
const db = require('../db')

// Middleware — simple shared secret check
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
  if (token !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }
  next()
}

router.use(requireAdmin)

// GET /api/admin/orders — all orders, newest first
router.get('/orders', async (req, res) => {
  try {
    const { status, search } = req.query
    let where = '1=1'
    const params = []

    if (status && status !== 'all') {
      where += ' AND o.status = ?'
      params.push(status)
    }
    if (search) {
      where += ' AND (o.order_id LIKE ? OR o.customer_first_name LIKE ? OR o.customer_last_name LIKE ? OR o.customer_phone LIKE ?)'
      const s = `%${search}%`
      params.push(s, s, s, s)
    }

    const [orders] = await db.execute(
      `SELECT o.*,
        COUNT(i.id) AS item_count,
        SUM(i.quantity) AS total_qty
       FROM orders o
       LEFT JOIN order_items i ON o.order_id = i.order_id
       WHERE ${where}
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      params
    )

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/admin/orders/:orderId — single order with items
router.get('/orders/:orderId', async (req, res) => {
  try {
    const [[order]] = await db.execute(
      'SELECT * FROM orders WHERE order_id = ?',
      [req.params.orderId]
    )
    if (!order) return res.status(404).json({ error: 'Commande introuvable' })

    const [items] = await db.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.orderId]
    )

    res.json({ ...order, items })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PATCH /api/admin/orders/:orderId/status — update status
router.patch('/orders/:orderId/status', async (req, res) => {
  const { status } = req.body
  const valid = ['en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' })
  }
  try {
    await db.execute(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, req.params.orderId]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/admin/orders/:orderId — suppression définitive
router.delete('/orders/:orderId', async (req, res) => {
  try {
    await db.execute('DELETE FROM orders WHERE order_id = ?', [req.params.orderId])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [[counts]] = await db.execute(`
      SELECT
        COUNT(*) AS total,
        SUM(total) AS revenue,
        SUM(status = 'en_attente') AS pending,
        SUM(status = 'en_livraison') AS delivering,
        SUM(status = 'livree') AS delivered,
        SUM(status = 'annulee') AS cancelled
      FROM orders
    `)
    res.json(counts)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ─── PRODUCT CRUD ────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseProductRow(row) {
  if (!row) return null
  const tryJ = (v, d) => { try { return JSON.parse(v) } catch { return d } }
  return {
    dbId: row.id,
    id: parseInt(row.product_id),
    slug: row.slug,
    name: { fr: row.name_fr, en: row.name_en },
    category: row.category,
    producer: row.producer,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    wholesalePrice: row.wholesale_price ? Number(row.wholesale_price) : null,
    currency: 'XOF',
    images: tryJ(row.images, []),
    description: { fr: row.description_fr || '', en: row.description_en || '' },
    features: { fr: tryJ(row.features_fr, []), en: tryJ(row.features_en, []) },
    dimensions: row.dimensions || '',
    weight: row.weight || '',
    stock: row.stock,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    tags: tryJ(row.tags, []),
    badge: row.badge_fr ? { fr: row.badge_fr, en: row.badge_en || '' } : null,
    featured: !!row.featured,
    isNew: !!row.is_new,
    active: !!row.active,
    region: { fr: row.region_fr || '', en: row.region_en || '' },
  }
}

// GET /api/admin/products — all products (including inactive)
router.get('/products', async (req, res) => {
  try {
    const { category, search } = req.query
    let where = '1=1'
    const params = []
    if (category && category !== 'all') { where += ' AND category = ?'; params.push(category) }
    if (search) {
      where += ' AND (name_fr LIKE ? OR name_en LIKE ? OR slug LIKE ?)'
      const s = `%${search}%`; params.push(s, s, s)
    }
    const [rows] = await db.execute(`SELECT * FROM products WHERE ${where} ORDER BY id ASC`, params)
    res.json(rows.map(parseProductRow))
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erreur serveur' }) }
})

// POST /api/admin/products — create
router.post('/products', async (req, res) => {
  try {
    const d = req.body
    const slug = d.slug || slugify(d.name_fr)
    // auto product_id = max(product_id)+1
    const [[maxRow]] = await db.execute('SELECT MAX(CAST(product_id AS UNSIGNED)) AS maxid FROM products')
    const newId = (maxRow.maxid || 0) + 1

    const [result] = await db.execute(
      `INSERT INTO products
        (product_id,slug,name_fr,name_en,category,producer,price,original_price,wholesale_price,
         description_fr,description_en,features_fr,features_en,images,dimensions,weight,
         stock,rating,review_count,tags,badge_fr,badge_en,featured,is_new,active,region_fr,region_en)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [String(newId), slug, d.name_fr, d.name_en || '', d.category, d.producer,
       d.price, d.original_price || null, d.wholesale_price || null,
       d.description_fr || '', d.description_en || '',
       JSON.stringify(d.features_fr || []), JSON.stringify(d.features_en || []),
       JSON.stringify(d.images || []),
       d.dimensions || '', d.weight || '',
       d.stock || 0, d.rating || 0, d.review_count || 0,
       JSON.stringify(d.tags || []),
       d.badge_fr || null, d.badge_en || null,
       d.featured ? 1 : 0, d.is_new ? 1 : 0, 1,
       d.region_fr || '', d.region_en || '']
    )
    const [[created]] = await db.execute('SELECT * FROM products WHERE id = ?', [result.insertId])
    res.status(201).json(parseProductRow(created))
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }) }
})

// PUT /api/admin/products/:id — update
router.put('/products/:id', async (req, res) => {
  try {
    const d = req.body
    await db.execute(
      `UPDATE products SET
        name_fr=?, name_en=?, slug=?, category=?, producer=?,
        price=?, original_price=?, wholesale_price=?,
        description_fr=?, description_en=?,
        features_fr=?, features_en=?, images=?,
        dimensions=?, weight=?, stock=?, tags=?,
        badge_fr=?, badge_en=?, featured=?, is_new=?, active=?,
        region_fr=?, region_en=?
       WHERE id=?`,
      [d.name_fr, d.name_en || '', d.slug,
       d.category, d.producer, d.price, d.original_price || null, d.wholesale_price || null,
       d.description_fr || '', d.description_en || '',
       JSON.stringify(d.features_fr || []), JSON.stringify(d.features_en || []),
       JSON.stringify(d.images || []),
       d.dimensions || '', d.weight || '', d.stock || 0,
       JSON.stringify(d.tags || []),
       d.badge_fr || null, d.badge_en || null,
       d.featured ? 1 : 0, d.is_new ? 1 : 0, d.active !== false ? 1 : 0,
       d.region_fr || '', d.region_en || '',
       req.params.id]
    )
    const [[updated]] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id])
    res.json(parseProductRow(updated))
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }) }
})

// DELETE /api/admin/products/:id — hard delete
router.delete('/products/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

// PATCH /api/admin/products/:id/toggle — quick toggle featured/is_new/active
router.patch('/products/:id/toggle', async (req, res) => {
  const { field } = req.body
  const allowed = ['featured', 'is_new', 'active']
  if (!allowed.includes(field)) return res.status(400).json({ error: 'Champ invalide' })
  try {
    await db.execute(`UPDATE products SET ${field} = NOT ${field} WHERE id = ?`, [req.params.id])
    const [[row]] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id])
    res.json({ [field]: !!row[field] })
  } catch (err) { res.status(500).json({ error: err.message }) }
})

module.exports = router
