import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLanguage } from '../context/LanguageContext'

export default function Newsletter() {
  const { t, lang } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    toast.success(t.footer.newsletter.success)
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-earth-800 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-white" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            {t.sections.newsletter}
          </h2>
          <p className="text-white/80 text-base mb-8 leading-relaxed">
            {t.sections.newsletterSubtitle}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.footer.newsletter.placeholder}
              required
              className="flex-1 px-5 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30
                         text-white placeholder-white/60 text-sm
                         focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20
                         transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white text-primary-600 font-bold text-sm rounded-xl
                         hover:bg-sand-100 transition-all duration-200
                         disabled:opacity-70 flex items-center justify-center gap-2 flex-shrink-0"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              ) : null}
              {t.footer.newsletter.button}
            </button>
          </form>

          <p className="text-white/50 text-xs mt-4">
            {lang === 'fr'
              ? "Pas de spam. Désinscription en un clic."
              : "No spam. Unsubscribe with one click."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
