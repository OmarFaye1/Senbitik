import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice } from '../utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shipping, total, totalItems, effectivePrice } = useCart()
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-earth-950/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-earth-950 shadow-2xl flex flex-col"
            role="dialog"
            aria-label={t.cart.title}
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-sand-200 dark:border-earth-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary-500" />
                <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100">
                  {t.cart.title}
                </h2>
                {totalItems > 0 && (
                  <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    {totalItems} {t.cart.items}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="btn-ghost p-2"
                aria-label={t.common.close}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-sand-100 dark:bg-earth-800 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-earth-300 dark:text-earth-600" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold text-earth-700 dark:text-sand-300">
                      {t.cart.empty}
                    </p>
                    <p className="text-sm text-earth-400 mt-1">{t.cart.emptySubtitle}</p>
                  </div>
                  <Link
                    to="/boutique"
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    {t.cart.continueShopping}
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 p-3 rounded-xl bg-sand-50 dark:bg-earth-900"
                      >
                        <Link to={`/produit/${item.slug}`} onClick={closeCart} className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/produit/${item.slug}`}
                            onClick={closeCart}
                            className="font-medium text-sm text-earth-900 dark:text-sand-100 line-clamp-2 hover:text-primary-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="price-tag text-sm">
                              {formatPrice(effectivePrice(item))}
                            </p>
                            {item.quantity >= 10 && item.wholesalePrice && (
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                Grossiste
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg border border-sand-200 dark:border-earth-700 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors"
                                aria-label="Diminuer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-7 h-7 rounded-lg border border-sand-200 dark:border-earth-700 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors disabled:opacity-40"
                                aria-label="Augmenter"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-earth-400 hover:text-red-500 transition-colors p-1"
                              aria-label={t.cart.remove}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-sand-200 dark:border-earth-800 p-5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-earth-600 dark:text-earth-300">
                    <span>{t.cart.subtotal}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-earth-600 dark:text-earth-300">
                    <span>{t.cart.shipping}</span>
                    <span>{shipping === 0 ? t.cart.shippingFree : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-earth-900 dark:text-sand-100 text-base pt-2 border-t border-sand-200 dark:border-earth-800">
                    <span>{t.cart.total}</span>
                    <span className="price-tag text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link
                  to="/commande"
                  onClick={closeCart}
                  className="btn-primary w-full"
                >
                  {t.cart.checkout}
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-earth-500 hover:text-primary-500 transition-colors py-1"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
