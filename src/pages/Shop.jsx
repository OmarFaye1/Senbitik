import { motion } from 'framer-motion'
import { Filter, Grid, LayoutList, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/Skeleton'
import { useLanguage } from '../context/LanguageContext'
import { categories } from '../data/categories'
import { producers } from '../data/producers'
import { filterProducts, formatPrice, sortProducts } from '../utils'

const ITEMS_PER_PAGE = 12

export default function Shop() {
  const { t, lang, getText } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)

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
      search: filters.search,
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
  const hasActiveFilters = filters.category !== 'all' || filters.producer || filters.minPrice || filters.maxPrice || filters.rating > 0 || filters.search

  const sortOptions = [
    { value: 'featured', label: lang === 'fr' ? 'En vedette' : 'Featured' },
    { value: 'newest', label: lang === 'fr' ? 'Nouveautés' : 'Newest' },
    { value: 'price-asc', label: lang === 'fr' ? 'Prix croissant' : 'Price: Low to High' },
    { value: 'price-desc', label: lang === 'fr' ? 'Prix décroissant' : 'Price: High to Low' },
    { value: 'rating', label: lang === 'fr' ? 'Mieux notés' : 'Best Rated' },
  ]

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">
          {filters.category !== 'all'
            ? getText(categories.find(c => c.id === filters.category)?.name) || t.nav.shop
            : t.nav.shop
          }
        </h1>
        <p className="text-earth-500 dark:text-earth-400 mt-1 text-sm">
          {filteredProducts.length} {lang === 'fr' ? 'produits' : 'products'}
        </p>
      </div>

      {/* Search + toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
          <input
            type="search"
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder={lang === 'fr' ? 'Rechercher un produit...' : 'Search a product...'}
            className="input-field pl-9 pr-4"
          />
          {filters.search && (
            <button onClick={() => updateFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input-field py-2 pr-8 cursor-pointer min-w-40"
            aria-label={t.common.sort}
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-ghost gap-2 flex-shrink-0 ${showFilters ? 'bg-primary-50 dark:bg-primary-950 text-primary-500' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">{t.common.filter}</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary-500" />}
          </button>

          <div className="flex border border-sand-200 dark:border-earth-700 rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-earth-500 hover:bg-sand-50 dark:hover:bg-earth-800'} transition-colors`} aria-label="Grille">
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-earth-500 hover:bg-sand-50 dark:hover:bg-earth-800'} transition-colors`} aria-label="Liste">
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar */}
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-60 flex-shrink-0 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-earth-900 dark:text-sand-100">
                <Filter className="w-4 h-4 inline mr-1" /> {t.common.filter}
              </h2>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-primary-500 hover:underline">
                  {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold text-earth-700 dark:text-sand-300 mb-3 uppercase tracking-wider">
                {t.common.category}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="category" value="all" checked={filters.category === 'all'} onChange={() => updateFilter('category', 'all')} className="accent-primary-500" />
                  <span className="text-sm text-earth-600 dark:text-earth-300">{lang === 'fr' ? 'Toutes catégories' : 'All categories'}</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" value={cat.id} checked={filters.category === cat.id} onChange={() => updateFilter('category', cat.id)} className="accent-primary-500" />
                    <span className="text-sm text-earth-600 dark:text-earth-300">{cat.icon} {getText(cat.name)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Producer */}
            <div>
              <h3 className="text-sm font-semibold text-earth-700 dark:text-sand-300 mb-3 uppercase tracking-wider">
                {lang === 'fr' ? 'Producteur' : 'Producer'}
              </h3>
              <select
                value={filters.producer}
                onChange={e => updateFilter('producer', e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="">{lang === 'fr' ? 'Tous' : 'All'}</option>
                {producers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-semibold text-earth-700 dark:text-sand-300 mb-3 uppercase tracking-wider">
                {t.common.price}
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={e => updateFilter('minPrice', e.target.value)}
                  placeholder="Min"
                  className="input-field py-2 text-sm w-full"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={e => updateFilter('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="input-field py-2 text-sm w-full"
                />
              </div>
              {(filters.minPrice || filters.maxPrice) && (
                <p className="text-xs text-earth-400 mt-1">
                  {filters.minPrice ? formatPrice(Number(filters.minPrice)) : '0'} – {filters.maxPrice ? formatPrice(Number(filters.maxPrice)) : '∞'}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-earth-700 dark:text-sand-300 mb-3 uppercase tracking-wider">
                {lang === 'fr' ? 'Note minimum' : 'Min Rating'}
              </h3>
              <div className="space-y-2">
                {[0, 4, 4.5, 4.8].map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" checked={filters.rating === r} onChange={() => updateFilter('rating', r)} className="accent-primary-500" />
                    <span className="text-sm text-earth-600 dark:text-earth-300">
                      {r === 0 ? (lang === 'fr' ? 'Toutes notes' : 'All ratings') : `${r}+ ⭐`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.aside>
        )}

        {/* Mobile filters */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-earth-950/50" onClick={() => setShowFilters(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-earth-950 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-bold">{t.common.filter}</h2>
                <button onClick={() => setShowFilters(false)} className="btn-ghost p-2"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider">{t.common.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => updateFilter('category', 'all')} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.category === 'all' ? 'bg-primary-500 text-white' : 'bg-sand-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300'}`}>
                      {lang === 'fr' ? 'Toutes' : 'All'}
                    </button>
                    {categories.map(cat => (
                      <button key={cat.id} onClick={() => updateFilter('category', cat.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filters.category === cat.id ? 'bg-primary-500 text-white' : 'bg-sand-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300'}`}>
                        {cat.icon} {getText(cat.name)}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setShowFilters(false); resetFilters() }} className="w-full btn-outline text-sm py-2">
                  {lang === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}
                </button>
                <button onClick={() => setShowFilters(false)} className="w-full btn-primary">
                  {lang === 'fr' ? `Voir ${filteredProducts.length} produits` : `See ${filteredProducts.length} products`}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6' : 'grid-cols-1 gap-6'}`}>
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-serif text-2xl font-bold text-earth-700 dark:text-sand-300 mb-2">
                {t.common.noResults}
              </h3>
              <p className="text-earth-500 mb-6">
                {lang === 'fr' ? 'Essayez de modifier vos filtres de recherche.' : 'Try adjusting your search filters.'}
              </p>
              <button onClick={resetFilters} className="btn-primary">
                {lang === 'fr' ? 'Effacer les filtres' : 'Clear filters'}
              </button>
            </div>
          ) : (
            <>
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6' : 'grid-cols-1 gap-6'}`}>
                {paginatedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="btn-outline"
                  >
                    {lang === 'fr' ? 'Voir plus de produits' : 'Load more products'}
                    <span className="text-earth-400 text-sm ml-1">
                      ({filteredProducts.length - paginatedProducts.length} {lang === 'fr' ? 'restants' : 'remaining'})
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
