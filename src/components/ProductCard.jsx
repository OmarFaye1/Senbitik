import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useWishlist } from '../hooks/useWishlist'
import { formatPrice, getDiscountPercent } from '../utils'
import StarRating from './StarRating'

export default function ProductCard({ product, index = 0, listMode = false }) {
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className={`group relative bg-white dark:bg-earth-900 border border-gray-200 dark:border-earth-700 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md transition-all duration-200 ${listMode ? 'flex flex-row' : 'flex flex-col'}`}
    >
      <Link
        to={`/produit/${product.slug}`}
        className={listMode ? 'flex flex-row flex-1 min-w-0' : 'flex flex-col flex-1'}
        aria-label={getText(product.name)}
      >

        {/* ── IMAGE ── */}
        <div className={`relative overflow-hidden bg-gray-50 dark:bg-earth-800 flex-shrink-0 ${listMode ? 'w-36 sm:w-48 h-36 sm:h-48' : 'w-full aspect-square'}`}>
          <img
            src={product.images?.[0] || ''}
            alt={getText(product.name)}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'opacity-40' : ''}`}
          />

          {/* Badges top-left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPct > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white leading-tight">
                -{discountPct}%
              </span>
            )}
            {product.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white leading-tight">
                {getText(product.badge)}
              </span>
            )}
            {product.isNew && !product.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white leading-tight">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={inWishlist ? t.product.removeFromWishlist : t.product.addToWishlist}
            className={`absolute top-2 right-2 w-7 h-7 bg-white dark:bg-earth-800 border border-gray-200 dark:border-earth-600
                        flex items-center justify-center transition-all duration-200 hover:border-red-300
                        ${inWishlist ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:group-hover:opacity-100'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
          </button>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-earth-900/50">
              <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1">
                {t.product.outOfStock}
              </span>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className={`flex flex-col flex-1 min-w-0 ${listMode ? 'p-3 sm:p-4' : 'p-2.5 sm:p-3'}`}>

          {/* Product name */}
          <h3 className={`font-medium text-gray-800 dark:text-gray-200 leading-snug mb-1.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors ${listMode ? 'text-sm sm:text-base line-clamp-2' : 'text-xs sm:text-sm line-clamp-2'}`}>
            {getText(product.name)}
          </h3>

          {/* Description — mode liste seulement */}
          {listMode && product.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-2 hidden sm:block">
              {typeof product.description === 'object' ? (product.description[lang] || product.description.fr) : product.description}
            </p>
          )}

          {/* Price block */}
          <div className="mb-1.5">
            {product.wholesalePrice ? (
              <>
                <div className="flex items-baseline gap-1 flex-wrap">
                  <span className={`font-bold text-orange-500 ${listMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs">–</span>
                  <span className={`font-semibold text-gray-500 dark:text-gray-400 ${listMode ? 'text-sm' : 'text-xs sm:text-sm'}`}>
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {lang === 'fr' ? 'Min. commande : 10 unités' : 'Min. order: 10 units'}
                </p>
              </>
            ) : (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-bold text-orange-500 ${listMode ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <StarRating rating={product.rating} size="xs" hideCount />
            {product.reviewCount > 0 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                ({product.reviewCount})
              </span>
            )}
          </div>

          {/* Livraison 24h */}
          <div className="flex items-center gap-1 mb-1.5">
            <Truck className="w-3 h-3 text-green-500 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
              {lang === 'fr' ? 'Livraison sous 24h' : 'Delivery within 24h'}
            </span>
          </div>

        </div>
      </Link>

      {/* Add to cart */}
      {listMode ? (
        /* Mode liste : bouton à droite */
        <div className="flex flex-col items-center justify-center px-3 py-3 border-l border-gray-100 dark:border-earth-700 flex-shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-32 sm:w-36 py-2 text-xs font-semibold border border-orange-500 text-orange-500
                       hover:bg-orange-500 hover:text-white active:bg-orange-600
                       transition-colors duration-150 flex items-center justify-center gap-1.5
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? t.product.outOfStock : t.product.addToCart}
          </button>
        </div>
      ) : (
        /* Mode grille : bouton en bas pleine largeur */
        <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full py-1.5 text-xs font-semibold border border-orange-500 text-orange-500
                       hover:bg-orange-500 hover:text-white active:bg-orange-600
                       transition-colors duration-150 flex items-center justify-center gap-1.5
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{isOutOfStock ? t.product.outOfStock : t.product.addToCart}</span>
            <span className="xs:hidden">{isOutOfStock ? '✗' : '+'}</span>
          </button>
        </div>
      )}
    </motion.article>
  )
}
