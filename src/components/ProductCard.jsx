import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useWishlist } from '../hooks/useWishlist'
import { formatPrice, getDiscountPercent } from '../utils'
import StarRating from './StarRating'

export default function ProductCard({ product, index = 0 }) {
  const { t, lang, getText } = useLanguage()
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)
  const discountPct = getDiscountPercent(product.originalPrice, product.price)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (isOutOfStock) return
    addItem(product, 1, lang)
    toast.success(t.product.addedToCart, { description: getText(product.name) })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    toggleWishlist(product.id)
    toast(inWishlist ? t.product.removeFromWishlist : t.product.addToWishlist, {
      icon: inWishlist ? '💔' : '❤️',
    })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: 'easeOut' } }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative card hover:shadow-warm-lg transition-shadow duration-300"
    >
      <Link to={`/produit/${product.slug}`} className="block" aria-label={getText(product.name)}>

        {/* ── IMAGE ── */}
        <div className="relative h-40 sm:h-60 lg:h-64 overflow-hidden bg-sand-100 dark:bg-earth-800 rounded-t-2xl">
          <img
            src={product.images?.[0] || ''}
            alt={getText(product.name)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'opacity-50' : ''}`}
          />

          {/* Gradient vignette on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500 text-white shadow-sm">
                {getText(product.badge)}
              </span>
            )}
            {discountPct > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-500 text-white shadow-sm">
                -{discountPct}%
              </span>
            )}
            {product.isNew && !product.badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-500 text-white shadow-sm">
                {lang === 'fr' ? 'Nouveau' : 'New'}
              </span>
            )}
          </div>

          {/* Wishlist — toujours visible sur mobile, hover uniquement sur desktop */}
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? t.product.removeFromWishlist : t.product.addToWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full shadow-md
                        flex items-center justify-center transition-all duration-200 hover:scale-110
                        ${inWishlist
                          ? 'bg-white opacity-100'
                          : 'bg-white/90 dark:bg-earth-800/90 opacity-100 lg:opacity-0 lg:group-hover:opacity-100'
                        }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-earth-500'}`} />
          </button>

          {/* Overlay "Ajouter au panier" — toujours visible sur mobile, hover uniquement sur desktop */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 left-1/2 -translate-x-1/2
                         bg-white dark:bg-earth-900 text-earth-900 dark:text-sand-100
                         px-4 py-2 rounded-xl text-xs font-semibold
                         border border-sand-200 dark:border-earth-700 shadow-warm
                         flex items-center gap-1.5 whitespace-nowrap
                         opacity-100 translate-y-0
                         lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0
                         transition-all duration-300 hover:bg-primary-500 hover:text-white hover:border-primary-500"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t.product.addToCart}
            </button>
          )}

          {/* Out of stock */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center rounded-t-2xl bg-white/30 dark:bg-earth-900/40">
              <span className="bg-earth-900/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                {t.product.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className="p-2.5 sm:p-4">
          {/* Name */}
          <h3 className="font-serif font-semibold text-earth-900 dark:text-sand-100 text-xs sm:text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {getText(product.name)}
          </h3>

          <StarRating rating={product.rating} size="xs" count={product.reviewCount} hideCount />

          {/* Price + cart button */}
          <div className="mt-2 flex items-end justify-between gap-1">
            <div className="min-w-0">
              {product.wholesalePrice ? (
                <>
                  {/* Fourchette style Alibaba */}
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="price-tag text-sm sm:text-base font-bold">
                      {formatPrice(product.wholesalePrice)}
                    </span>
                    <span className="text-earth-400 text-xs">–</span>
                    <span className="text-earth-500 dark:text-earth-400 text-xs sm:text-sm font-semibold">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  {/* Paliers */}
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                      ≥ 10 · {formatPrice(product.wholesalePrice)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="price-tag text-sm sm:text-lg font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="hidden sm:inline ml-2 text-xs text-earth-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={t.product.addToCart}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary-500 text-white flex-shrink-0
                         flex items-center justify-center
                         hover:bg-primary-600 active:scale-95
                         transition-all duration-200 shadow-warm hover:shadow-warm-lg
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
