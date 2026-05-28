import { motion } from 'framer-motion'
import { Award, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Newsletter from '../components/Newsletter'
import ProducerCard from '../components/ProducerCard'
import { useLanguage } from '../context/LanguageContext'
import { producers } from '../data/producers'

export default function Producers() {
  const { lang, getText } = useLanguage()

  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-secondary-50 via-sand-50 to-white dark:from-secondary-950/30 dark:via-earth-900 dark:to-earth-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary-100 dark:bg-secondary-950/20 blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-100 dark:bg-secondary-950 text-secondary-600 dark:text-secondary-400 text-sm font-semibold mb-6"
          >
            🌿 {lang === 'fr' ? 'Producteurs Certifiés' : 'Certified Producers'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-earth-900 dark:text-sand-100 mb-6"
          >
            {lang === 'fr' ? 'Nos Producteurs Partenaires' : 'Our Partner Producers'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-earth-600 dark:text-earth-300 max-w-2xl mx-auto"
          >
            {lang === 'fr'
              ? "Des femmes et des hommes passionnés qui perpétuent les traditions ancestrales et créent des produits d'exception pour votre quotidien."
              : "Passionate men and women who perpetuate ancestral traditions and create exceptional products for your everyday life."}
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 bg-white dark:bg-earth-900 border-y border-sand-200 dark:border-earth-800">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Award, title: lang === 'fr' ? 'Sélection rigoureuse' : 'Rigorous selection', desc: lang === 'fr' ? 'Chaque producteur est audité et certifié avant de rejoindre Senbitik' : 'Each producer is audited and certified before joining Senbitik' },
            { icon: Star, title: lang === 'fr' ? 'Prix juste' : 'Fair price', desc: lang === 'fr' ? 'Nous garantissons une rémunération équitable pour chaque producteur' : 'We guarantee fair compensation for every producer' },
            { icon: MapPin, title: lang === 'fr' ? 'Ancrage local' : 'Local roots', desc: lang === 'fr' ? 'Tous nos partenaires sont ancrés dans leurs communautés locales' : 'All our partners are rooted in their local communities' },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-50 dark:bg-secondary-950 flex items-center justify-center">
                <v.icon className="w-6 h-6 text-secondary-500" />
              </div>
              <h3 className="font-semibold text-earth-900 dark:text-sand-100">{v.title}</h3>
              <p className="text-sm text-earth-500 dark:text-earth-400">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Producers grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {producers.map((producer, i) => (
              <ProducerCard key={producer.id} producer={producer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured producer spotlight */}
      {producers[0] && (
        <section className="py-20 px-4 bg-gradient-to-br from-earth-950 to-primary-950">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge bg-primary-500 text-white mb-4 inline-block">
                ⭐ {lang === 'fr' ? 'Producteur du mois' : 'Producer of the month'}
              </span>
              <h2 className="font-serif text-3xl font-bold text-white mb-4">
                {producers[0].name}
              </h2>
              <p className="text-earth-300 leading-relaxed mb-6">
                {getText(producers[0].story)}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {producers[0].certifications.map(cert => (
                  <span key={cert} className="badge bg-white/10 text-white/80 text-xs">{cert}</span>
                ))}
              </div>
              <Link to={`/producteurs/${producers[0].slug}`} className="btn-primary">
                {lang === 'fr' ? 'Voir tous ses produits' : 'See all their products'}
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={producers[0].coverImage} alt={producers[0].name} className="w-full h-72 object-cover" />
            </div>
          </div>
        </section>
      )}

      {/* CTA become producer */}
      <section className="py-16 px-4 text-center bg-sand-50 dark:bg-earth-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-4">
            {lang === 'fr' ? 'Rejoignez notre réseau de producteurs' : 'Join our producer network'}
          </h2>
          <p className="text-earth-600 dark:text-earth-300 mb-8">
            {lang === 'fr'
              ? "Vous êtes artisan, agriculteur ou producteur local ? Rejoignez Senbitik et touchez des milliers de clients à travers le monde."
              : "Are you a craftsman, farmer or local producer? Join Senbitik and reach thousands of customers worldwide."}
          </p>
          <Link to="/contact" className="btn-secondary">
            {lang === 'fr' ? 'Devenir partenaire' : 'Become a partner'}
          </Link>
        </div>
      </section>

      <Newsletter />
    </main>
  )
}
