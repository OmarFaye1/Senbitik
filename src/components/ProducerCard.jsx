import { motion } from 'framer-motion'
import { MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function ProducerCard({ producer, index = 0 }) {
  const { lang, getText } = useLanguage()

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group card hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
    >
      <Link to={`/producteurs/${producer.slug}`}>
        {/* Cover */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={producer.coverImage}
            alt={producer.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-950/60 to-transparent" />

          {/* Certifications */}
          {producer.certifications?.length > 0 && (
            <div className="absolute top-3 right-3">
              <span className="badge bg-secondary-500 text-white text-xs">
                ✓ {producer.certifications[0]}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-3 -mt-8 mb-4 relative">
            <img
              src={producer.avatar}
              alt={producer.name}
              className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white dark:ring-earth-900 shadow-md"
            />
            <div className="mt-6">
              <h3 className="font-serif font-bold text-earth-900 dark:text-sand-100 text-base group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {producer.name}
              </h3>
              <div className="flex items-center gap-1 text-earth-500 dark:text-earth-400 text-xs">
                <MapPin className="w-3 h-3" />
                {getText(producer.location)}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-earth-600 dark:text-earth-300 line-clamp-3 leading-relaxed mb-4">
            {getText(producer.description)}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-accent-600 dark:text-accent-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold">{producer.rating}</span>
              <span className="text-earth-400">({producer.reviewCount})</span>
            </div>
            <div className="text-earth-400">
              {producer.productCount} {lang === 'fr' ? 'produits' : 'products'}
            </div>
            <div className="text-earth-400">
              {lang === 'fr' ? 'Depuis' : 'Since'} {producer.founded}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
