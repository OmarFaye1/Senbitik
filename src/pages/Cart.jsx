import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils'

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clearCart, effectivePrice } = useCart()
  const { t, lang } = useLanguage()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const applyPromo = () => {
    const codes = { SENBITIK10: 0.1, BIENVENUE: 0.15, TERROIR: 0.05 }
    const pct = codes[promoCode.toUpperCase()]
    if (pct) {
      setDiscount(pct)
      toast.success(lang === 'fr' ? `Code appliqué : ${(pct * 100).toFixed(0)}% de réduction !` : `Code applied: ${(pct * 100).toFixed(0)}% discount!`)
    } else {
      toast.error(lang === 'fr' ? 'Code promo invalide' : 'Invalid promo code')
    }
  }

  const discountAmount = Math.round(subtotal * discount)
  const finalTotal = total - discountAmount

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 rounded-full bg-sand-100 dark:bg-earth-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-earth-300 dark:text-earth-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-earth-800 dark:text-sand-100 mb-3">
            {t.cart.empty}
          </h1>
          <p className="text-earth-500 mb-8">{t.cart.emptySubtitle}</p>
          <Link to="/boutique" className="btn-primary">
            <ShoppingBag className="w-4 h-4" />
            {t.cart.continueShopping}
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-2">{t.cart.title}</h1>
      <p className="text-earth-500 mb-8">
        {items.reduce((s, i) => s + i.quantity, 0)} {t.cart.items}
      </p>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="card p-5 flex gap-5"
            >
              <Link to={`/produit/${item.slug}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/produit/${item.slug}`}
                  className="font-serif font-semibold text-earth-900 dark:text-sand-100 hover:text-primary-500 transition-colors line-clamp-2 text-base"
                >
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {item.quantity >= 10 && item.wholesalePrice && (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      🏷️ {lang === 'fr' ? 'Prix grossiste' : 'Wholesale'}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-sand-200 dark:border-earth-700 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-lg border border-sand-200 dark:border-earth-700 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="price-tag text-base block">
                        {formatPrice(effectivePrice(item) * item.quantity)}
                      </span>
                      {item.quantity >= 10 && item.wholesalePrice && (
                        <span className="text-xs text-earth-400 line-through">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-earth-400 hover:text-red-500 transition-colors"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Link to="/boutique" className="flex items-center gap-2 text-earth-500 hover:text-primary-500 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t.cart.continueShopping}
            </Link>
            <button
              onClick={() => {
                clearCart()
                toast.success(lang === 'fr' ? 'Panier vidé' : 'Cart cleared')
              }}
              className="text-sm text-red-400 hover:text-red-500 transition-colors"
            >
              {lang === 'fr' ? 'Vider le panier' : 'Clear cart'}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo code */}
          <div className="card p-5">
            <h2 className="font-semibold text-earth-900 dark:text-sand-100 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary-500" />
              {t.cart.promoCode}
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyPromo()}
                placeholder="SENBITIK10"
                className="input-field py-2.5 text-sm flex-1"
              />
              <button onClick={applyPromo} className="btn-primary text-sm px-4 py-2.5 flex-shrink-0">
                {t.cart.apply}
              </button>
            </div>
            <p className="text-xs text-earth-400 mt-2">
              {lang === 'fr' ? 'Essayez SENBITIK10, BIENVENUE ou TERROIR' : 'Try SENBITIK10, BIENVENUE or TERROIR'}
            </p>
          </div>

          {/* Total card */}
          <div className="card p-5 space-y-3">
            <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100 mb-4">
              {lang === 'fr' ? 'Récapitulatif' : 'Summary'}
            </h2>

            <div className="flex justify-between text-sm text-earth-600 dark:text-earth-300">
              <span>{t.cart.subtotal}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>{lang === 'fr' ? 'Réduction' : 'Discount'} ({(discount * 100).toFixed(0)}%)</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-earth-600 dark:text-earth-300">
              <span>{t.cart.shipping}</span>
              <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                {shipping === 0 ? t.cart.shippingFree : formatPrice(shipping)}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-earth-400 bg-sand-50 dark:bg-earth-900 rounded-lg p-2">
                {lang === 'fr'
                  ? `Livraison gratuite à partir de ${formatPrice(50000)}`
                  : `Free delivery from ${formatPrice(50000)}`}
              </p>
            )}

            <div className="border-t border-sand-200 dark:border-earth-800 pt-3">
              <div className="flex justify-between font-bold text-earth-900 dark:text-sand-100">
                <span className="text-lg">{t.cart.total}</span>
                <span className="price-tag text-xl">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Link to="/commande" className="btn-primary w-full mt-4 text-base py-3.5">
              {t.cart.checkout}
            </Link>

            <div className="flex items-center justify-center gap-4 pt-2">
              {['🔒', '✓', '🚚'].map((icon, i) => (
                <span key={i} className="text-xs text-earth-400 flex items-center gap-1">
                  {icon} {i === 0 ? (lang === 'fr' ? 'Sécurisé' : 'Secure') : i === 1 ? (lang === 'fr' ? 'Certifié' : 'Certified') : (lang === 'fr' ? 'Rapide' : 'Fast')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
