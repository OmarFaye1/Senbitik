import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { formatDate } from '../utils'
import StarRating from './StarRating'

export default function TestimonialCard({ testimonial, index = 0 }) {
  const { lang, getText } = useLanguage()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between">
        <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 flex-shrink-0" />
        <StarRating rating={testimonial.rating} size="sm" />
      </div>

      <p className="text-sm text-earth-700 dark:text-earth-300 leading-relaxed italic line-clamp-4">
        "{getText(testimonial.text)}"
      </p>

      <div className="mt-auto">
        <div className="text-xs text-primary-500 dark:text-primary-400 font-semibold mb-3">
          {testimonial.product}
        </div>
        <div className="flex items-center gap-3">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-9 h-9 rounded-full object-cover"
            loading="lazy"
          />
          <div>
            <p className="font-semibold text-sm text-earth-900 dark:text-sand-100">
              {testimonial.name}
            </p>
            <p className="text-xs text-earth-400">
              {getText(testimonial.location)} · {formatDate(testimonial.date, lang === 'fr' ? 'fr-FR' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
