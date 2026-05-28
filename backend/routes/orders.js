const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/orders — called from checkout on confirm
router.post('/', async (req, res) => {
  const { orderId, customer, address, payment, items, subtotal, shipping, total } = req.body

  if (!orderId || !customer || !items?.length) {
    return res.status(400).json({ error: 'Données manquantes' })
  }

  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    await conn.execute(
      `INSERT INTO orders
        (order_id, customer_first_name, customer_last_name, customer_phone,
         city, quartier, payment_method, subtotal, shipping, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customer.firstName,
        customer.lastName,
        customer.phone,
        address.city,
        address.quartier || '',
        payment.method,
        subtotal,
        shipping,
        total,
      ]
    )

    for (const item of items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.image || '', item.price, item.quantity]
      )
    }

    await conn.commit()
    res.status(201).json({ success: true, orderId })
  } catch (err) {
    await conn.rollback()
    console.error('Erreur création commande:', err)
    res.status(500).json({ error: 'Erreur serveur' })
  } finally {
    conn.release()
  }
})

module.exports = router
