import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function CategoryCard({ category, index = 0 }) {
  const { getText } = useLanguage()

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      <Link to={`/boutique?categorie=${category.slug}`}>
        <div className="relative h-44 sm:h-52">
          <img
            src={category.image}
            alt={getText(category.name)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-earth-950/20 to-transparent group-hover:from-primary-900/80 transition-all duration-300" />

          <div className="absolute inset-0 p-5 flex flex-col justify-end">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl mb-1 block">{category.icon}</span>
                <h3 className="font-serif font-bold text-white text-lg leading-tight">
                  {getText(category.name)}
                </h3>
                <p className="text-white/70 text-xs mt-0.5">
                  {category.productCount} produits
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
