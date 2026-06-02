import { motion } from 'framer-motion'
import { ArrowRight, Award, Leaf, Search, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import Newsletter from '../components/Newsletter'
import ProductCard from '../components/ProductCard'
import TestimonialCard from '../components/TestimonialCard'
import { useLanguage } from '../context/LanguageContext'
import { categories } from '../data/categories'
import { testimonials } from '../data/testimonials'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

/* ── Bannières hero ── */
const BANNERS = [
  {
    bg: 'from-orange-600 to-amber-500',
    img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80',
    tag: { fr: 'Artisanat', en: 'Crafts' },
    title: { fr: 'Bijoux & Artisanat\nde Saint-Louis', en: 'Jewelry & Crafts\nfrom Saint-Louis' },
    cta: '/boutique?categorie=artisanat',
  },
  {
    bg: 'from-emerald-700 to-teal-500',
    img: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=700&q=80',
    tag: { fr: 'Bio & Terroir', en: 'Organic' },
    title: { fr: 'Épices & Produits\nBio de Thiès', en: 'Spices & Organic\nfrom Thiès' },
    cta: '/boutique?categorie=alimentation',
  },
  {
    bg: 'from-purple-700 to-pink-600',
    img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=700&q=80',
    tag: { fr: 'Cosmétiques', en: 'Cosmetics' },
    title: { fr: 'Cosmétiques\nNaturels Casamance', en: 'Natural Cosmetics\nfrom Casamance' },
    cta: '/boutique?categorie=cosmetiques',
  },
]

const MINI_BANNERS = [
  {
    img: 'https://images.unsplash.com/photo-1558171813-1e46e59b765b?w=400&q=80',
    label: { fr: 'Textiles Wax', en: 'Wax Textiles' },
    cta: '/boutique?categorie=textile',
    color: 'from-amber-800/70',
  },
  {
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    label: { fr: 'Décoration', en: 'Decoration' },
    cta: '/boutique?categorie=decoration',
    color: 'from-teal-800/70',
  },
]

export default function Home() {
  const { t, lang, getText } = useLanguage()
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [activeBanner, setActiveBanner] = useState(0)
  const [search, setSearch] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    fetch('/api/products?featured=1')
      .then(r => r.json())
      .then(setFeaturedProducts)
      .catch(() => {})
    fetch('/api/products?is_new=1')
      .then(r => r.json())
      .then(data => setNewProducts(data.slice(0, 4)))
      .catch(() => {})
  }, [])

  /* Auto-slide banner */
  useEffect(() => {
    intervalRef.current = setInterval(() => setActiveBanner(i => (i + 1) % BANNERS.length), 4000)
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/boutique?q=${encodeURIComponent(search.trim())}`)
    else navigate('/boutique')
  }

  const stats = [
    { value: '50+',   label: t.hero.stat1 },
    { value: '200+',  label: t.hero.stat2 },
    { value: '5000+', label: t.hero.stat3 },
    { value: '12',    label: t.hero.stat4 },
  ]

  const values = [
    { icon: Leaf,       title: lang === 'fr' ? '100% Naturel'         : '100% Natural',          desc: lang === 'fr' ? 'Produits sans additifs chimiques' : 'Products without chemical additives' },
    { icon: Award,      title: lang === 'fr' ? 'Artisanat Certifié'   : 'Certified Crafts',       desc: lang === 'fr' ? 'Chaque artisan est sélectionné'   : 'Each artisan is hand-picked' },
    { icon: Truck,      title: lang === 'fr' ? 'Livraison sous 24h'   : 'Delivery within 24h',    desc: lang === 'fr' ? 'Express à Dakar, 3-5j partout'    : 'Express in Dakar, 3-5d nationwide' },
    { icon: ShieldCheck,title: lang === 'fr' ? 'Achat Sécurisé'       : 'Secure Purchase',        desc: lang === 'fr' ? 'Satisfait ou remboursé 30 jours'  : '30-day money-back guarantee' },
  ]

  const banner = BANNERS[activeBanner]

  return (
    <main>

      {/* ══════════════════════════════════════════════
          HERO — barre de recherche + bannières
      ══════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-earth-950">

        {/* Barre orange top avec search */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-orange-100 text-sm font-medium mb-3 flex items-center justify-center gap-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              🇸🇳 {t.hero.badge}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-2"
            >
              {t.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-orange-100 text-lg sm:text-xl font-medium mb-6"
            >
              {t.hero.titleHighlight}
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSearch}
              className="flex max-w-2xl mx-auto shadow-lg"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={lang === 'fr' ? 'Rechercher des produits sénégalais...' : 'Search Senegalese products...'}
                  className="w-full pl-10 pr-4 py-3 sm:py-3.5 text-sm bg-white dark:bg-earth-800 text-gray-800 dark:text-gray-100 border-0 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 sm:px-7 py-3 sm:py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors flex-shrink-0"
              >
                {lang === 'fr' ? 'Chercher' : 'Search'}
              </button>
            </motion.form>

            {/* Stats inline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex items-center justify-center gap-4 sm:gap-8 flex-wrap"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <span className="text-white font-bold text-lg sm:text-xl">{s.value}</span>
                  <span className="text-orange-200 text-xs sm:text-sm ml-1">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Raccourcis catégories ── */}
        <div className="bg-gray-50 dark:bg-earth-900 border-b border-gray-200 dark:border-earth-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={`/boutique?categorie=${cat.id}`}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 border-b-2 border-transparent hover:border-orange-500 transition-all whitespace-nowrap"
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-medium">{getText(cat.name)}</span>
                </Link>
              ))}
              <Link
                to="/boutique"
                className="flex-shrink-0 flex items-center gap-1 px-4 py-3 text-sm text-orange-500 font-semibold hover:bg-orange-50 dark:hover:bg-orange-950/20 border-b-2 border-transparent hover:border-orange-500 transition-all whitespace-nowrap ml-auto"
              >
                {lang === 'fr' ? 'Tout voir' : 'See all'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bannières produits ── */}
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

            {/* Grande bannière gauche — auto-slide */}
            <div className="sm:col-span-2 relative rounded-xl overflow-hidden h-52 sm:h-64 cursor-pointer group"
              onClick={() => navigate(banner.cta)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} transition-all duration-700`} />
              <motion.img
                key={activeBanner}
                src={banner.img}
                alt=""
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 top-0 h-full w-1/2 object-cover mix-blend-multiply opacity-70"
              />
              <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between h-full">
                <span className="inline-block px-2.5 py-1 bg-white/20 text-white text-xs font-semibold rounded-full w-fit">
                  {banner.tag[lang]}
                </span>
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold leading-snug mb-3 whitespace-pre-line">
                    {banner.title[lang]}
                  </h2>
                  <button className="px-4 py-2 bg-white text-orange-600 text-xs font-bold rounded-full hover:bg-orange-50 transition-colors flex items-center gap-1.5 w-fit">
                    {lang === 'fr' ? 'Découvrir' : 'Explore'} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Indicateurs */}
              <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
                {BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setActiveBanner(i); clearInterval(intervalRef.current) }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeBanner ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {/* Deux mini bannières droite */}
            <div className="flex sm:flex-col gap-3">
              {MINI_BANNERS.map((mb, i) => (
                <Link
                  key={i}
                  to={mb.cta}
                  className="relative flex-1 rounded-xl overflow-hidden h-28 sm:h-auto group"
                >
                  <img src={mb.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${mb.color} to-transparent`} />
                  <span className="absolute bottom-2.5 left-3 text-white text-sm font-bold">
                    {mb.label[lang]}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VALEURS — bande de confiance
      ══════════════════════════════════════════════ */}
      <section className="py-8 bg-white dark:bg-earth-900 border-y border-gray-200 dark:border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{v.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5 hidden sm:block">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRODUITS EN VEDETTE
      ══════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-earth-950">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.sections.featuredProducts}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.sections.featuredSubtitle}</p>
            </div>
            <Link to="/boutique" className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
              {t.common.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATÉGORIES
      ══════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-earth-900">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t.sections.categories}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.sections.categoriesSubtitle}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          NOUVEAUTÉS
      ══════════════════════════════════════════════ */}
      {newProducts.length > 0 && (
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white dark:bg-earth-900">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="flex items-center justify-between mb-6">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full mb-2">
                  ✨ {lang === 'fr' ? 'Tout nouveaux' : 'Brand new'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t.sections.newArrivals}
                </h2>
              </div>
              <Link to="/boutique" className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors">
                {t.common.seeAll} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════
          TÉMOIGNAGES
      ══════════════════════════════════════════════ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-earth-950">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{t.sections.testimonials}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.sections.testimonialsSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.slice(0, 3).map((item, i) => (
              <TestimonialCard key={item.id} testimonial={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />

      {/* ── BOUTON FLOTTANT ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <Link
          to="/boutique"
          className="flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          {lang === 'fr' ? 'Voir nos produits' : 'Browse products'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </main>
  )
}
