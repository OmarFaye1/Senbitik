import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  Heart, MapPin, Minus, Package, Plus,
  Share2, ShoppingCart, Star, Truck, X, ZoomIn
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import ProductCard from '../components/ProductCard'
import { ProductDetailSkeleton } from '../components/Skeleton'
import StarRating from '../components/StarRating'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useWishlist } from '../hooks/useWishlist'
import { producers } from '../data/producers'
import { formatPrice, getDiscountPercent, getStockStatus } from '../utils'

/* ── Lightbox ── */
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex)
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>

      {/* Image */}
      <motion.div
        className="relative max-w-4xl max-h-[85vh] w-full px-14"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Vue ${current + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-contain max-h-[85vh] rounded-xl"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); setCurrent(i) }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${current === i ? 'border-white' : 'border-white/30 opacity-50 hover:opacity-80'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Main page ── */
export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, lang, getText } = useLanguage()
  const { addItem, openCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [similarProducts, setSimilarProducts] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setLoadingProduct(true)
    setNotFound(false)
    setSelectedImage(0)
    setQuantity(1)
    fetch(`/api/products/${slug}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => {
        if (data) {
          setProduct(data)
          fetch(`/api/products?category=${data.category}`)
            .then(r => r.json())
            .then(all => setSimilarProducts(all.filter(p => p.id !== data.id).slice(0, 4)))
            .catch(() => {})
        }
        setLoadingProduct(false)
      })
      .catch(() => { setNotFound(true); setLoadingProduct(false) })
  }, [slug])

  /* Loading */
  if (loadingProduct) return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        {[80, 20, 60, 20, 80, 20, 140].map((w, i) => (
          <div key={i} className={`skeleton h-3 rounded`} style={{ width: w }} />
        ))}
      </div>
      <ProductDetailSkeleton />
    </main>
  )
  if (notFound || !product) return <Navigate to="/boutique" replace />

  const producer = product.producer !== 'anonyme' ? producers.find(p => p.id === product.producer) : null
  const inWishlist = isInWishlist(product.id)
  const discountPct = getDiscountPercent(product.originalPrice, product.price)
  const stockStatus = getStockStatus(product.stock, lang)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    addItem(product, quantity, lang)
    toast.success(t.product.addedToCart, { description: `${quantity}× ${getText(product.name)}` })
    openCart()
  }

  const handleBuyNow = () => {
    addItem(product, quantity, lang)
    navigate('/commande')
  }

  const handleWishlist = () => {
    toggleWishlist(product.id)
    toast(inWishlist ? t.product.removeFromWishlist : t.product.addToWishlist, {
      icon: inWishlist ? '💔' : '❤️',
    })
  }

  const prevImage = () => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)
  const nextImage = () => setSelectedImage(i => (i + 1) % product.images.length)

  const featuresList = Array.isArray(product.features?.[lang])
    ? product.features[lang]
    : Array.isArray(product.features?.fr) ? product.features.fr : []

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={product.images}
            startIndex={selectedImage}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-earth-400 mb-8 flex-wrap">
        <Link to="/" className="hover:text-primary-500 transition-colors">{lang === 'fr' ? 'Accueil' : 'Home'}</Link>
        <span>/</span>
        <Link to="/boutique" className="hover:text-primary-500 transition-colors">{t.nav.shop}</Link>
        <span>/</span>
        <Link to={`/boutique?categorie=${product.category}`} className="hover:text-primary-500 transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-earth-700 dark:text-sand-300 truncate max-w-[180px]">{getText(product.name)}</span>
      </nav>

      {/* ── MAIN GRID ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start"
      >

        {/* ── GALLERY (left) ── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative group">
            <div
              className="relative rounded-2xl overflow-hidden bg-sand-100 dark:bg-earth-800 aspect-square cursor-zoom-in"
              onClick={() => product.images.length > 0 && setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={`${getText(product.name)} — vue ${selectedImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </AnimatePresence>

              {/* Zoom hint */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); prevImage() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-earth-900/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); nextImage() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-earth-900/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Discount badge */}
              {discountPct > 0 && (
                <div className="absolute top-4 left-4">
                  <span className="bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                    -{discountPct}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? 'border-primary-500 shadow-warm scale-[1.04]'
                      : 'border-transparent opacity-60 hover:opacity-90 hover:border-sand-300'
                  }`}
                >
                  <img src={img} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── INFO (right, sticky) ── */}
        <div className="space-y-5 lg:sticky lg:top-[100px] self-start">

          {/* Category + badge */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="badge-primary capitalize">{product.category}</span>
            {product.badge && (
              <span className="badge bg-primary-500 text-white">{getText(product.badge)}</span>
            )}
            {product.isNew && (
              <span className="badge bg-secondary-500 text-white">
                {lang === 'fr' ? 'Nouveau' : 'New'}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-earth-900 dark:text-sand-100 leading-tight">
            {getText(product.name)}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} size="md" showValue count={product.reviewCount} />
            <span className="text-sm text-earth-400">({product.reviewCount} {t.product.reviews})</span>
          </div>

          {/* Price */}
          <div className="space-y-2.5">
            {/* Effective price — updates live with quantity */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-serif text-4xl font-bold text-primary-600 dark:text-primary-400">
                {formatPrice((quantity >= 10 && product.wholesalePrice) ? product.wholesalePrice : product.price)}
              </span>
              {product.originalPrice && !(quantity >= 10 && product.wholesalePrice) && (
                <span className="text-xl text-earth-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {discountPct > 0 && !(quantity >= 10 && product.wholesalePrice) && (
                <span className="badge bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-sm">
                  {lang === 'fr' ? 'Économisez' : 'Save'} {discountPct}%
                </span>
              )}
              {quantity >= 10 && product.wholesalePrice && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                  ✓ {lang === 'fr' ? 'Prix grossiste appliqué' : 'Wholesale price applied'}
                </span>
              )}
            </div>

            {/* Wholesale price info banner */}
            {product.wholesalePrice && (
              <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
                quantity >= 10
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-sand-50 dark:bg-earth-900 border-sand-200 dark:border-earth-700'
              }`}>
                <span className="text-base flex-shrink-0">🏷️</span>
                <div className="text-sm leading-snug">
                  <span className="text-earth-500 dark:text-earth-400">
                    {lang === 'fr' ? 'Unitaire : ' : 'Unit: '}
                  </span>
                  <span className={`font-semibold ${quantity < 10 ? 'text-primary-600 dark:text-primary-400' : 'text-earth-500 dark:text-earth-400'}`}>
                    {formatPrice(product.price)}
                  </span>
                  <span className="mx-2 text-earth-300 dark:text-earth-600">·</span>
                  <span className="text-earth-500 dark:text-earth-400">
                    {lang === 'fr' ? 'Grossiste ≥ 10 : ' : 'Wholesale ≥ 10: '}
                  </span>
                  <span className={`font-bold ${quantity >= 10 ? 'text-emerald-600 dark:text-emerald-400' : 'text-earth-700 dark:text-sand-300'}`}>
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  {quantity < 10 && (
                    <span className="ml-2 text-xs text-earth-400 dark:text-earth-500">
                      {lang === 'fr'
                        ? `(encore ${10 - quantity} pour le prix grossiste)`
                        : `(${10 - quantity} more for wholesale)`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.label}</span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-orange-500 font-medium">
                — {lang === 'fr' ? `Plus que ${product.stock}` : `Only ${product.stock} left`}
              </span>
            )}
          </div>

          {/* Producer card */}
          {producer && (
            <Link
              to={`/producteurs/${producer.slug}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 dark:bg-earth-900 hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors border border-sand-100 dark:border-earth-800"
            >
              <img src={producer.avatar} alt={producer.name} className="w-10 h-10 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-earth-400 dark:text-earth-500">{t.product.producerOf}</p>
                <p className="font-semibold text-sm text-earth-800 dark:text-sand-200 truncate">{producer.name}</p>
                <div className="flex items-center gap-1 text-xs text-earth-400">
                  <MapPin className="w-3 h-3" />
                  {getText(producer.location)}
                </div>
              </div>
              <Star className="w-4 h-4 text-accent-500 fill-current ml-auto flex-shrink-0" />
            </Link>
          )}

          {/* Quantity + Actions */}
          {!isOutOfStock ? (
            <div className="space-y-4 pt-1">
              {/* Quantity selector */}
              <div>
                <label className="text-sm font-semibold text-earth-700 dark:text-sand-300 mb-2 block">
                  {t.product.quantity}
                </label>
                <div className="inline-flex items-center gap-0 rounded-xl border border-sand-200 dark:border-earth-700 overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors text-earth-600 dark:text-earth-300 disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg border-x border-sand-200 dark:border-earth-700 h-11 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-sand-100 dark:hover:bg-earth-800 transition-colors text-earth-600 dark:text-earth-300 disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3">
                <button onClick={handleAddToCart} className="btn-primary flex-1 text-base py-3.5">
                  <ShoppingCart className="w-5 h-5" />
                  {t.product.addToCart}
                </button>
                <button onClick={handleBuyNow} className="btn-outline flex-1 text-base py-3.5">
                  {lang === 'fr' ? 'Acheter' : 'Buy now'}
                </button>
              </div>

              {/* Wishlist + Share */}
              <div className="flex gap-2">
                <button
                  onClick={handleWishlist}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    inWishlist
                      ? 'border-red-300 bg-red-50 dark:bg-red-950/30 text-red-500'
                      : 'border-sand-200 dark:border-earth-700 text-earth-500 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist
                    ? (lang === 'fr' ? 'Dans vos favoris' : 'In wishlist')
                    : (lang === 'fr' ? 'Ajouter aux favoris' : 'Add to wishlist')
                  }
                </button>
                <button
                  onClick={async () => {
                    const url = window.location.href
                    const title = getText(product.name)
                    if (navigator.share) {
                      try { await navigator.share({ title, url }) } catch {}
                    } else {
                      try {
                        await navigator.clipboard.writeText(url)
                        toast.success(lang === 'fr' ? 'Lien copié !' : 'Link copied!', {
                          description: url,
                          duration: 3000,
                        })
                      } catch {
                        toast.error(lang === 'fr' ? 'Impossible de copier le lien' : 'Could not copy link')
                      }
                    }
                  }}
                  className="w-12 h-11 rounded-xl border-2 border-sand-200 dark:border-earth-700 flex items-center justify-center text-earth-500 hover:border-primary-300 hover:text-primary-500 transition-all"
                  title={lang === 'fr' ? 'Partager' : 'Share'}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium text-center">
              {t.product.outOfStock} — {lang === 'fr' ? 'Revenez bientôt !' : 'Check back soon!'}
            </div>
          )}

          {/* Delivery info */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
              <Truck className="w-4 h-4 text-secondary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-earth-800 dark:text-sand-200">
                  {lang === 'fr' ? 'Livraison' : 'Delivery'}
                </p>
                <p className="text-xs text-earth-500">{lang === 'fr' ? 'Gratuite dès 50 000 FCFA' : 'Free from 50 000 XOF'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
              <Package className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-earth-800 dark:text-sand-200">
                  {lang === 'fr' ? 'Retour' : 'Return'}
                </p>
                <p className="text-xs text-earth-500">{lang === 'fr' ? '30 jours satisfait ou remboursé' : '30-day money-back'}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/boutique?q=${tag}`}
                  className="text-xs px-3 py-1 rounded-full bg-sand-100 dark:bg-earth-800 text-earth-500 dark:text-earth-400 hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ── TABS ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mb-20"
      >
        <div className="flex gap-1 border-b border-sand-200 dark:border-earth-800 mb-8 overflow-x-auto scrollbar-hide">
          {[
            { key: 'description', label: t.product.description },
            { key: 'features', label: t.product.characteristics },
            { key: 'producer', label: lang === 'fr' ? 'Producteur' : 'Producer' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-earth-500 hover:text-earth-700 dark:hover:text-earth-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Description */}
            {activeTab === 'description' && (
              <div>
                <p className="text-earth-700 dark:text-earth-300 leading-relaxed text-base mb-6 max-w-3xl">
                  {getText(product.description)}
                </p>
                {(product.dimensions || product.weight || product.region?.fr) && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {product.dimensions && (
                      <div className="text-center p-4 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
                        <p className="text-xs text-earth-400 uppercase tracking-wider mb-1">{lang === 'fr' ? 'Dimensions' : 'Size'}</p>
                        <p className="font-semibold text-earth-800 dark:text-sand-200 text-sm">{product.dimensions}</p>
                      </div>
                    )}
                    {product.weight && (
                      <div className="text-center p-4 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
                        <p className="text-xs text-earth-400 uppercase tracking-wider mb-1">{lang === 'fr' ? 'Poids' : 'Weight'}</p>
                        <p className="font-semibold text-earth-800 dark:text-sand-200 text-sm">{product.weight}</p>
                      </div>
                    )}
                    {product.region?.fr && (
                      <div className="text-center p-4 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
                        <p className="text-xs text-earth-400 uppercase tracking-wider mb-1">{lang === 'fr' ? 'Région' : 'Region'}</p>
                        <p className="font-semibold text-earth-800 dark:text-sand-200 text-sm">{getText(product.region)}</p>
                      </div>
                    )}
                    <div className="text-center p-4 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
                      <p className="text-xs text-earth-400 uppercase tracking-wider mb-1">{lang === 'fr' ? 'En stock' : 'In stock'}</p>
                      <p className="font-semibold text-earth-800 dark:text-sand-200 text-sm">{product.stock}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {activeTab === 'features' && (
              <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
                {featuresList.length > 0 ? featuresList.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 rounded-xl bg-sand-50 dark:bg-earth-900 border border-sand-100 dark:border-earth-800">
                    <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-950 flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary-600 dark:text-secondary-400 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm text-earth-700 dark:text-earth-300">{f}</span>
                  </li>
                )) : (
                  <p className="text-earth-400 text-sm col-span-2">
                    {lang === 'fr' ? 'Aucune caractéristique disponible.' : 'No features available.'}
                  </p>
                )}
              </ul>
            )}

            {/* Producer */}
            {activeTab === 'producer' && producer && (
              <div className="grid sm:grid-cols-2 gap-8 max-w-3xl">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={producer.avatar} alt={producer.name} className="w-16 h-16 rounded-2xl object-cover shadow" />
                    <div>
                      <h3 className="font-serif font-bold text-xl text-earth-900 dark:text-sand-100">{producer.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-earth-500">
                        <MapPin className="w-3.5 h-3.5" />
                        {getText(producer.location)}
                      </div>
                      <StarRating rating={producer.rating} size="xs" showValue count={producer.reviewCount} />
                    </div>
                  </div>
                  <p className="text-earth-600 dark:text-earth-300 text-sm leading-relaxed mb-4">
                    {getText(producer.story)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {producer.certifications.map(cert => (
                      <span key={cert} className="badge-secondary text-xs">{cert}</span>
                    ))}
                  </div>
                  <Link to={`/producteurs/${producer.slug}`} className="btn-outline mt-4 inline-flex text-sm">
                    {lang === 'fr' ? 'Voir le producteur' : 'View producer'}
                  </Link>
                </div>
                <div className="rounded-2xl overflow-hidden h-48 sm:h-auto">
                  <img src={producer.coverImage} alt={producer.name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            {activeTab === 'producer' && !producer && (
              <p className="text-earth-400 text-sm">
                {lang === 'fr' ? 'Informations producteur non disponibles.' : 'Producer info not available.'}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── SIMILAR PRODUCTS ── */}
      {similarProducts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">{t.product.similarProducts}</h2>
            <Link
              to={`/boutique?categorie=${product.category}`}
              className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
            >
              {lang === 'fr' ? 'Voir tous' : 'See all'}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Back */}
      <div className="mt-12">
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 text-earth-500 hover:text-primary-500 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.common.backToShop}
        </Link>
      </div>
    </main>
  )
}
