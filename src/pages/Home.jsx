import { motion } from 'framer-motion'
import { ArrowRight, Award, Leaf, ShieldCheck, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import Newsletter from '../components/Newsletter'
import ProducerCard from '../components/ProducerCard'
import ProductCard from '../components/ProductCard'
import TestimonialCard from '../components/TestimonialCard'
import { useLanguage } from '../context/LanguageContext'
import { categories } from '../data/categories'
import { producers } from '../data/producers'
import { testimonials } from '../data/testimonials'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

export default function Home() {
  const { t, lang } = useLanguage()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newProducts, setNewProducts] = useState([])

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

  const stats = [
    { value: '50+', label: t.hero.stat1 },
    { value: '200+', label: t.hero.stat2 },
    { value: '5000+', label: t.hero.stat3 },
    { value: '12', label: t.hero.stat4 },
  ]

  const values = [
    { icon: Leaf, title: lang === 'fr' ? '100% Naturel' : '100% Natural', desc: lang === 'fr' ? 'Produits sans additifs chimiques, issus de la nature' : 'Products without chemical additives, straight from nature' },
    { icon: Award, title: lang === 'fr' ? 'Artisanat Certifié' : 'Certified Craftsmanship', desc: lang === 'fr' ? "Chaque artisan est sélectionné et certifié par notre équipe" : 'Each artisan is selected and certified by our team' },
    { icon: Truck, title: lang === 'fr' ? 'Livraison Rapide' : 'Fast Delivery', desc: lang === 'fr' ? '24-48h à Dakar, 3-5 jours partout au Sénégal et en diaspora' : '24-48h in Dakar, 3-5 days across Senegal and diaspora' },
    { icon: ShieldCheck, title: lang === 'fr' ? 'Achat Sécurisé' : 'Secure Purchase', desc: lang === 'fr' ? 'Paiement sécurisé et satisfait ou remboursé 30 jours' : 'Secure payment and 30-day money-back guarantee' },
  ]

  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-sand-100 via-sand-50 to-white dark:from-earth-950 dark:via-earth-900 dark:to-earth-950">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-100 dark:bg-primary-950/30 blur-3xl opacity-60" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-secondary-100 dark:bg-secondary-950/30 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-50 dark:bg-accent-950/10 blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
            >
              <span className="text-earth-900 dark:text-sand-100">{t.hero.title}</span>
              <br />
              <span className="text-gradient">{t.hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-earth-600 dark:text-earth-300 leading-relaxed mb-8 max-w-lg"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/boutique" className="btn-primary">
                {t.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/producteurs" className="btn-outline">
                {t.hero.ctaSecondary}
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 grid grid-cols-4 gap-6"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-serif text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero image mosaic */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80', alt: 'Artisanat', className: 'row-span-2 h-80' },
              { src: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80', alt: 'Miel', className: 'h-36' },
              { src: 'https://images.unsplash.com/photo-1558171813-1e46e59b765b?w=400&q=80', alt: 'Textile', className: 'h-36' },
            ].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-warm ${img.className}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-12 bg-white dark:bg-earth-900 border-y border-sand-200 dark:border-earth-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-earth-900 dark:text-sand-100 text-sm">{v.title}</h3>
                  <p className="text-xs text-earth-500 dark:text-earth-400 mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">{t.sections.featuredProducts}</h2>
              <p className="section-subtitle mt-2">{t.sections.featuredSubtitle}</p>
            </div>
            <Link to="/boutique" className="hidden sm:flex items-center gap-2 text-primary-500 font-semibold text-sm hover:gap-3 transition-all">
              {t.common.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="mt-8 sm:hidden text-center">
            <Link to="/boutique" className="btn-outline">
              {t.common.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sand-50 dark:bg-earth-900">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="section-title">{t.sections.categories}</h2>
            <p className="section-subtitle mt-2">{t.sections.categoriesSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCERS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">{t.sections.producers}</h2>
              <p className="section-subtitle mt-2">{t.sections.producersSubtitle}</p>
            </div>
            <Link to="/producteurs" className="hidden sm:flex items-center gap-2 text-primary-500 font-semibold text-sm hover:gap-3 transition-all">
              {t.common.seeAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {producers.slice(0, 3).map((producer, i) => (
              <ProducerCard key={producer.id} producer={producer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {newProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-secondary-50 to-sand-50 dark:from-secondary-950/20 dark:to-earth-900">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeInUp} className="flex items-end justify-between mb-10">
              <div>
                <span className="badge-secondary text-sm mb-2 inline-block">✨ {lang === 'fr' ? 'Tout nouveaux' : 'Brand new'}</span>
                <h2 className="section-title">{t.sections.newArrivals}</h2>
              </div>
              <Link to="/boutique?filter=nouveau" className="hidden sm:flex items-center gap-2 text-secondary-600 font-semibold text-sm hover:gap-3 transition-all">
                {t.common.seeAll} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="section-title">{t.sections.testimonials}</h2>
            <p className="section-subtitle mt-2">{t.sections.testimonialsSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t, i) => (
              <TestimonialCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />
    </main>
  )
}
