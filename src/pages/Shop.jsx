import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, LayoutList, Grid3X3, Search, SlidersHorizontal, Truck, ShieldCheck, RefreshCw, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { useLanguage } from '../context/LanguageContext'
import { categories } from '../data/categories'
import { producers } from '../data/producers'
import { filterProducts, formatPrice, sortProducts } from '../utils'

const ITEMS_PER_PAGE = 20

export default function Shop() {
  const { t, lang, getText } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expanded, setExpanded] = useState({ category: true, price: true, producer: false, rating: false })

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('categorie') || 'all',
    producer: searchParams.get('producteur') || '',
    minPrice: '',
    maxPrice: '',
    rating: 0,
  })
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    setLoading(true)
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setAllProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const newParams = {}
    if (filters.search) newParams.q = filters.search
    if (filters.category && filters.category !== 'all') newParams.categorie = filters.category
    setSearchParams(newParams, { replace: true })
    setPage(1)
  }, [filters.search, filters.category])

  const filteredProducts = useMemo(() => {
    const f = filterProducts(allProducts, {
      ...filters,
      category: filters.category === 'all' ? null : filters.category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : null,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : null,
    })
    return sortProducts(f, sortBy)
  }, [allProducts, filters, sortBy])

  const paginatedProducts = filteredProducts.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = paginatedProducts.length < filteredProducts.length

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  const resetFilters = () => {
    setFilters({ search: '', category: 'all', producer: '', minPrice: '', maxPrice: '', rating: 0 })
    setSortBy('featured')
  }
  const hasActiveFilters = filters.category !== 'all' || filters.producer || filters.minPrice || filters.maxPrice || filters.rating > 0

  const toggleSection = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))

  const sortOptions = [
    { value: 'featured',   label: lang === 'fr' ? 'En vedette'      : 'Featured' },
    { value: 'newest',     label: lang === 'fr' ? 'Nouveautés'      : 'Newest' },
    { value: 'price-asc',  label: lang === 'fr' ? 'Prix croissant'  : 'Price: Low to High' },
    { value: 'price-desc', label: lang === 'fr' ? 'Prix décroissant': 'Price: High to Low' },
    { value: 'rating',     label: lang === 'fr' ? 'Mieux notés'     : 'Best Rated' },
  ]

  /* ── Sidebar sections content (shared between desktop + mobile) ── */
  const SidebarContent = () => (
    <div className="space-y-0">
      {hasActiveFilters && (
        <div className="flex items-center justify-between px-1 pb-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {lang === 'fr' ? 'Filtres actifs' : 'Active filters'}
          </span>
          <button onClick={resetFilters} className="text-xs text-orange-500 hover:underline font-medium">
            {lang === 'fr' ? 'Tout effacer' : 'Clear all'}
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="border border-gray-200 dark:border-earth-700 mb-3">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-earth-800 hover:bg-gray-100 dark:hover:bg-earth-750"
        >
          {lang === 'fr' ? 'Catégories' : 'Categories'}
          {expanded.category
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {expanded.category && (
          <div className="py-1">
            <button
              onClick={() => updateFilter('category', 'all')}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                filters.category === 'all'
                  ? 'text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/20 border-l-2 border-orange-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-earth-800'
              }`}
            >
              {lang === 'fr' ? 'Toutes catégories' : 'All categories'}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => updateFilter('category', cat.id)}
                className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center gap-2 ${
                  filters.category === cat.id
                    ? 'text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/20 border-l-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-earth-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="truncate">{getText(cat.name)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price range */}
      <div className="border border-gray-200 dark:border-earth-700 mb-3">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-earth-800 hover:bg-gray-100 dark:hover:bg-earth-750"
        >
          {lang === 'fr' ? 'Fourchette de prix' : 'Price Range'}
          {expanded.price
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {expanded.price && (
          <div className="p-3 space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={filters.minPrice}
                onChange={e => updateFilter('minPrice', e.target.value)}
                placeholder="Min"
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-earth-600 bg-white dark:bg-earth-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
              />
              <span className="text-gray-400 text-xs flex-shrink-0">–</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={e => updateFilter('maxPrice', e.target.value)}
                placeholder="Max"
                className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-earth-600 bg-white dark:bg-earth-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400"
              />
            </div>
            {(filters.minPrice || filters.maxPrice) && (
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400">
                  {filters.minPrice ? formatPrice(Number(filters.minPrice)) : '0'} – {filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : '∞'}
                </p>
                <button
                  onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', '') }}
                  className="text-[10px] text-orange-500 hover:underline"
                >
                  {lang === 'fr' ? 'Effacer' : 'Clear'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Producer / Supplier */}
      <div className="border border-gray-200 dark:border-earth-700 mb-3">
        <button
          onClick={() => toggleSection('producer')}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-earth-800 hover:bg-gray-100 dark:hover:bg-earth-750"
        >
          {lang === 'fr' ? 'Fournisseur' : 'Supplier'}
          {expanded.producer
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {expanded.producer && (
          <div className="py-1">
            <button
              onClick={() => updateFilter('producer', '')}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                !filters.producer
                  ? 'text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/20 border-l-2 border-orange-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-earth-800'
              }`}
            >
              {lang === 'fr' ? 'Tous les fournisseurs' : 'All suppliers'}
            </button>
            {producers.map(p => (
              <button
                key={p.id}
                onClick={() => updateFilter('producer', p.id)}
                className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                  filters.producer === p.id
                    ? 'text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/20 border-l-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-earth-800'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border border-gray-200 dark:border-earth-700 mb-3">
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-earth-800 hover:bg-gray-100 dark:hover:bg-earth-750"
        >
          {lang === 'fr' ? 'Note minimale' : 'Min. Rating'}
          {expanded.rating
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {expanded.rating && (
          <div className="py-1">
            {[0, 4, 4.5, 4.8].map(r => (
              <button
                key={r}
                onClick={() => updateFilter('rating', r)}
                className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                  filters.rating === r
                    ? 'text-orange-600 font-semibold bg-orange-50 dark:bg-orange-950/20 border-l-2 border-orange-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-earth-800'
                }`}
              >
                {r === 0 ? (lang === 'fr' ? 'Toutes les notes' : 'All ratings') : `${r}+ ⭐`}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 dark:bg-earth-950 min-h-screen">

      {/* ── TRUST STRIP ── */}
      <div className="bg-orange-500 text-white py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Livraison express sous 24h' : 'Express delivery within 24h'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Produits 100% authentiques' : '100% authentic products'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Retours sous 7 jours' : '7-day returns'}
            </span>
          </div>
        </div>
      </div>

      {/* ── TOP SEARCH BAR ── */}
      <div className="bg-white dark:bg-earth-900 border-b border-gray-200 dark:border-earth-700 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher produits, fournisseurs...' : 'Search products, suppliers...'}
                className="w-full pl-9 pr-4 py-2 sm:py-2.5 border border-r-0 border-gray-300 dark:border-earth-600 bg-white dark:bg-earth-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-orange-400 dark:focus:border-orange-500"
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button className="px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'Chercher' : 'Search'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex gap-5">

          {/* ── LEFT SIDEBAR — desktop always visible ── */}
          <aside className="hidden lg:block w-52 xl:w-56 flex-shrink-0">
            <SidebarContent />
          </aside>

          {/* ── MAIN AREA ── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="bg-white dark:bg-earth-900 border border-gray-200 dark:border-earth-700 px-3 sm:px-4 py-2.5 mb-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-earth-600 px-2.5 py-1.5 hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {lang === 'fr' ? 'Filtres' : 'Filters'}
                  {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </button>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{filteredProducts.length}</span>{' '}
                  {lang === 'fr' ? 'produits' : 'products'}
                  {filters.category !== 'all' && (
                    <span className="text-orange-500 ml-1">
                      · {getText(categories.find(c => c.id === filters.category)?.name)}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline whitespace-nowrap">
                    {lang === 'fr' ? 'Trier :' : 'Sort:'}
                  </span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-xs sm:text-sm border border-gray-300 dark:border-earth-600 bg-white dark:bg-earth-800 text-gray-700 dark:text-gray-300 px-2 py-1.5 focus:outline-none focus:border-orange-400 cursor-pointer"
                  >
                    {sortOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex border border-gray-200 dark:border-earth-700">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-earth-800'}`}
                    aria-label="Grille"
                  >
                    <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 transition-colors ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-earth-800'}`}
                    aria-label="Liste"
                  >
                    <LayoutList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' : 'grid-cols-1 gap-2'}`}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-earth-900 border border-gray-200 dark:border-earth-700 text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">{t.common.noResults}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  {lang === 'fr' ? 'Essayez de modifier vos filtres de recherche.' : 'Try adjusting your search filters.'}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                >
                  {lang === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
                </button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' : 'grid-cols-1 gap-2'}`}>
                  {paginatedProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} listMode={viewMode === 'list'} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setPage(p => p + 1)}
                      className="px-8 py-2.5 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm font-semibold transition-colors"
                    >
                      {lang === 'fr' ? 'Voir plus de produits' : 'Load more'}
                      {' '}
                      <span className="opacity-70 text-xs">
                        ({filteredProducts.length - paginatedProducts.length} {lang === 'fr' ? 'restants' : 'remaining'})
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTERS DRAWER ── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-earth-900 overflow-y-auto shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-earth-700 bg-gray-50 dark:bg-earth-800">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                  <SlidersHorizontal className="w-4 h-4 inline mr-2" />
                  {lang === 'fr' ? 'Filtres' : 'Filters'}
                </h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <SidebarContent />
              </div>
              <div className="px-4 pb-6 flex gap-3">
                <button
                  onClick={() => { resetFilters(); setShowMobileFilters(false) }}
                  className="flex-1 py-2 border border-gray-300 dark:border-earth-600 text-sm text-gray-700 dark:text-gray-300 hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                >
                  {lang === 'fr' ? `Voir ${filteredProducts.length} produits` : `See ${filteredProducts.length} products`}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
