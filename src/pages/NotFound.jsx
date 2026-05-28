import { motion } from 'framer-motion'
import { ArrowLeft, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { lang } = useLanguage()
  const navigate = useNavigate()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <Logo size="md" />

        <div className="mt-12 mb-6">
          <span className="font-serif text-8xl font-bold text-gradient block">404</span>
          <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mt-4 mb-3">
            {lang === 'fr' ? 'Page introuvable' : 'Page not found'}
          </h1>
          <p className="text-earth-500 dark:text-earth-400">
            {lang === 'fr'
              ? "Oops ! La page que vous cherchez semble s'être égarée dans le terroir."
              : "Oops! The page you're looking for seems to have wandered off into the terroir."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="btn-outline">
            <ArrowLeft className="w-4 h-4" />
            {lang === 'fr' ? 'Retour' : 'Go back'}
          </button>
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" />
            {lang === 'fr' ? 'Accueil' : 'Home'}
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
