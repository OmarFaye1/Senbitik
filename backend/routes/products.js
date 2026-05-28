const express = require('express')
const router = express.Router()
const db = require('../db')

function parse(row) {
  if (!row) return null
  const tryJ = (v, d) => { try { return JSON.parse(v) } catch { return d } }
  return {
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
    dbId: row.id,
  }
}

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, featured, is_new, search, sort } = req.query
    let where = 'active = 1'
    const params = []
    if (category) { where += ' AND category = ?'; params.push(category) }
    if (featured === '1') { where += ' AND featured = 1' }
    if (is_new === '1') { where += ' AND is_new = 1' }
    if (search) {
      where += ' AND (name_fr LIKE ? OR name_en LIKE ? OR description_fr LIKE ?)'
      const s = `%${search}%`; params.push(s, s, s)
    }
    const orderMap = { price_asc: 'price ASC', price_desc: 'price DESC', rating: 'rating DESC', newest: 'created_at DESC' }
    const order = orderMap[sort] || 'id ASC'
    const [rows] = await db.execute(`SELECT * FROM products WHERE ${where} ORDER BY ${order}`, params)
    res.json(rows.map(parse))
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const [[row]] = await db.execute('SELECT * FROM products WHERE slug = ? AND active = 1', [req.params.slug])
    if (!row) return res.status(404).json({ error: 'Produit introuvable' })
    res.json(parse(row))
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router
