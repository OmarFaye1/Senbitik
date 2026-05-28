import { motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Package, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { formatDate, formatPrice } from '../utils'

const DEMO_ORDERS = [
  {
    id: 'NAT-LKJ8T2-AB3C',
    date: '2024-03-10',
    status: 'delivered',
    items: [
      { name: 'Beurre de Karité Pur', quantity: 2, price: 7500, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=100&q=80' },
      { name: 'Savon au Baobab & Moringa', quantity: 1, price: 3200, image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=100&q=80' },
    ],
    total: 18200,
    address: 'Bamako, Mali',
  },
  {
    id: 'NAT-MN9QP4-CD7E',
    date: '2024-02-22',
    status: 'shipped',
    items: [
      { name: 'Vase en Terre Cuite Gravé', quantity: 1, price: 18500, image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=100&q=80' },
    ],
    total: 22000,
    address: 'Dakar, Sénégal',
  },
  {
    id: 'NAT-RS5TU6-EF1G',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'Coffret Découverte Senbitik', quantity: 1, price: 38000, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&q=80' },
    ],
    total: 41500,
    address: 'Paris, France',
  },
]

const STATUS_CONFIG = {
  pending: { label: { fr: 'En attente', en: 'Pending' }, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400', icon: Package },
  processing: { label: { fr: 'En cours', en: 'Processing' }, color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400', icon: Package },
  shipped: { label: { fr: 'Expédié', en: 'Shipped' }, color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400', icon: Truck },
  delivered: { label: { fr: 'Livré', en: 'Delivered' }, color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400', icon: Package },
}

export default function Orders() {
  const { isAuthenticated } = useAuth()
  const { lang } = useLanguage()
  const [expanded, setExpanded] = useState(null)

  if (!isAuthenticated) return <Navigate to="/connexion" replace />

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-2">
        {lang === 'fr' ? 'Mes Commandes' : 'My Orders'}
      </h1>
      <p className="text-earth-500 mb-8 text-sm">
        {DEMO_ORDERS.length} {lang === 'fr' ? 'commandes' : 'orders'}
      </p>

      <div className="space-y-4">
        {DEMO_ORDERS.map((order, i) => {
          const status = STATUS_CONFIG[order.status]
          const StatusIcon = status.icon
          const isOpen = expanded === order.id

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card overflow-visible"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                className="w-full p-5 flex items-center gap-4 text-left hover:bg-sand-50 dark:hover:bg-earth-800/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-sand-100 dark:bg-earth-800 flex items-center justify-center flex-shrink-0">
                  <StatusIcon className="w-5 h-5 text-earth-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-earth-900 dark:text-sand-100 font-mono text-sm">{order.id}</span>
                    <span className={`badge text-xs ${status.color}`}>
                      {status.label[lang]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-earth-500">
                    <span>📅 {formatDate(order.date, lang === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    <span>📦 {order.items.length} {lang === 'fr' ? 'article(s)' : 'item(s)'}</span>
                    <span>📍 {order.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="price-tag font-bold">{formatPrice(order.total)}</span>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-earth-400" /> : <ChevronRight className="w-4 h-4 text-earth-400" />}
                </div>
              </button>

              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-sand-200 dark:border-earth-800 p-5"
                >
                  <div className="space-y-4">
                    {order.items.map((item, j) => (
                      <div key={j} className="flex gap-4 items-center">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-earth-800 dark:text-sand-200">{item.name}</p>
                          <p className="text-sm text-earth-400">×{item.quantity} — {formatPrice(item.price)}/u</p>
                        </div>
                        <span className="font-semibold text-primary-600">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 justify-between items-center border-t border-sand-100 dark:border-earth-800 pt-4">
                    <div className="text-sm font-bold text-earth-900 dark:text-sand-100">
                      Total : <span className="price-tag text-base">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'delivered' && (
                        <button className="btn-ghost text-sm py-2">
                          {lang === 'fr' ? '⭐ Laisser un avis' : '⭐ Leave a review'}
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="btn-outline text-sm py-2">
                          <Truck className="w-3.5 h-3.5" />
                          {lang === 'fr' ? 'Suivre' : 'Track'}
                        </button>
                      )}
                      <button className="btn-ghost text-sm py-2">
                        {lang === 'fr' ? 'Facture PDF' : 'PDF Invoice'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Link to="/boutique" className="btn-primary">
          {lang === 'fr' ? 'Continuer mes achats' : 'Continue shopping'}
        </Link>
      </div>
    </main>
  )
}
