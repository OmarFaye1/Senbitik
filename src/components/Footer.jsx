import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useLanguage } from '../context/LanguageContext'
import Logo from './Logo'

export default function Footer() {
  const { t, lang } = useLanguage()
  const [email, setEmail] = useState('')

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success(t.footer.newsletter.success)
    setEmail('')
  }

  const shopLinks = [
    { to: '/boutique', label: t.footer.allProducts },
    { to: '/boutique?filter=nouveau', label: t.footer.newArrivals },
    { to: '/boutique?filter=populaire', label: t.footer.bestSellers },
    { to: '/producteurs', label: t.nav.producers },
  ]

  const infoLinks = [
    { to: '/a-propos', label: t.footer.about },
    { to: '/contact', label: t.footer.contact },
    { to: '/faq', label: t.footer.faq },
    { to: '/cgv', label: t.footer.cgv },
    { to: '/mentions-legales', label: t.footer.legal },
  ]

  return (
    <footer className="bg-earth-950 text-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-5">
            <Logo size="sm" white />
            <p className="text-sm text-earth-400 leading-relaxed">
              {lang === 'fr'
                ? "Senbitik connecte les Sénégalais aux meilleurs producteurs locaux. Chaque achat soutient une famille sénégalaise et préserve un savoir-faire ancestral."
                : "Senbitik connects Senegalese customers to the best local producers. Every purchase supports a Senegalese family and preserves ancestral know-how."}
            </p>
            <div className="space-y-2 text-sm text-earth-400">
              <a href="mailto:contactsenbitik@gmail.com" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Mail className="w-4 h-4 flex-shrink-0" />
                contactsenbitik@gmail.com
              </a>
              <a href="tel:+221763961632" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +221 76 396 16 32
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Dakar, Sénégal
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-serif font-semibold text-sand-100 mb-5 text-base">
              {t.footer.shop}
            </h3>
            <ul className="space-y-3">
              {shopLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-earth-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-serif font-semibold text-sand-100 mb-5 text-base">
              {t.footer.info}
            </h3>
            <ul className="space-y-3">
              {infoLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-earth-400 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif font-semibold text-sand-100 mb-5 text-base">
              {t.footer.newsletter.title}
            </h3>
            <p className="text-sm text-earth-400 mb-4">
              {lang === 'fr'
                ? "Recevez nos offres exclusives et nouveautés."
                : "Receive our exclusive offers and news."}
            </p>
            <form onSubmit={handleNewsletter} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.footer.newsletter.placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-earth-900 border border-earth-700 text-sand-100 placeholder-earth-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
              <button type="submit" className="btn-primary w-full text-sm">
                {t.footer.newsletter.button}
              </button>
            </form>

            {/* Socials */}
            <div className="mt-6">
              <p className="text-xs text-earth-500 uppercase tracking-wider mb-3">{t.footer.followUs}</p>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: 'https://instagram.com/senbitik', label: 'Instagram' },
                  { icon: Facebook, href: 'https://facebook.com/senbitik', label: 'Facebook' },
                  { icon: Twitter, href: 'https://twitter.com/senbitik', label: 'Twitter' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-earth-800 flex items-center justify-center text-earth-400 hover:bg-primary-500 hover:text-white transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Categories bar */}
        <div className="py-6 border-t border-earth-800 flex flex-wrap gap-x-6 gap-y-2">
          {['Artisanat', 'Alimentation', 'Textile', 'Cosmétiques', 'Décoration'].map(cat => (
            <Link
              key={cat}
              to={`/boutique?categorie=${cat.toLowerCase()}`}
              className="text-xs text-earth-500 hover:text-primary-400 transition-colors uppercase tracking-wider"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-earth-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-earth-500">
            © {new Date().getFullYear()} Senbitik. {t.footer.rights}.
          </p>
          <p className="text-xs text-earth-600 flex items-center gap-1">
            {t.footer.madeWith} <span className="text-red-500">♥</span> {t.footer.forTerroir}
          </p>
          <div className="flex items-center gap-4">
            <img src="https://via.placeholder.com/40x24/1a1a1a/gold?text=VISA" alt="Visa" className="h-5 opacity-40" />
            <img src="https://via.placeholder.com/40x24/1a1a1a/gold?text=MC" alt="Mastercard" className="h-5 opacity-40" />
          </div>
        </div>
      </div>
    </footer>
  )
}
