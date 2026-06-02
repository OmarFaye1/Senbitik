import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import Logo from './Logo'

export default function Navbar() {
  const { t, lang, switchLang } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const { totalItems, toggleCart } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(
    () => !sessionStorage.getItem('promo-banner-dismissed')
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/boutique', label: t.nav.shop },
    { to: '/a-propos', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    toast.success(t.auth.logoutSuccess)
    navigate('/')
  }

  const dismissBanner = () => {
    setShowBanner(false)
    sessionStorage.setItem('promo-banner-dismissed', '1')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-earth-950/95 backdrop-blur-md shadow-sm border-b border-sand-200 dark:border-earth-800'
            : 'bg-white/80 dark:bg-earth-950/80 backdrop-blur-sm'
        }`}
      >
        {/* Bandeau promo */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-primary-600 dark:bg-primary-700 text-white text-xs sm:text-sm py-2 px-4 text-center relative flex items-center justify-center">
                <span>
                  🎁{' '}
                  {lang === 'fr'
                    ? <>Livraison gratuite dès <strong>50 000 FCFA</strong> · Code&nbsp;<strong>SENBITIK10</strong> pour −10%</>
                    : <>Free delivery from <strong>50 000 XOF</strong> · Use code&nbsp;<strong>SENBITIK10</strong> for −10%</>
                  }
                </span>
                <button
                  onClick={dismissBanner}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity p-1"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="sm" />

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                        : 'text-earth-700 dark:text-sand-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-sand-50 dark:hover:bg-earth-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Language */}
              <button
                onClick={() => switchLang(lang === 'fr' ? 'en' : 'fr')}
                className="hidden sm:flex btn-ghost text-xs font-bold uppercase tracking-wider px-2.5 py-1.5"
                aria-label="Switch language"
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="btn-ghost p-2"
                aria-label={isDark ? 'Mode clair' : 'Mode sombre'}
              >
                {isDark
                  ? <Sun className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />
                }
              </button>

              {/* Wishlist */}
              <NavLink to="/favoris" className="btn-ghost p-2 hidden sm:flex" aria-label={t.nav.wishlist}>
                <Heart className="w-4 h-4" />
              </NavLink>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="btn-ghost p-2 relative"
                aria-label={`${t.nav.cart} (${totalItems})`}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 btn-ghost pl-2 pr-3 py-1.5"
                    aria-expanded={userMenuOpen}
                    aria-label="Menu utilisateur"
                  >
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-earth-700 dark:text-sand-300 max-w-20 truncate">
                      {user.firstName}
                    </span>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 card shadow-lg border border-sand-200 dark:border-earth-700 py-1 z-50"
                        role="menu"
                      >
                        {[
                          ...(user?.role === 'admin' ? [{ to: '/admin', label: '⚙️ Admin' }] : []),
                          { to: '/profil', label: t.nav.profile },
                          { to: '/commandes', label: t.nav.orders },
                          { to: '/favoris', label: t.nav.wishlist },
                        ].map(item => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-earth-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-earth-800 transition-colors"
                            role="menuitem"
                          >
                            {item.label}
                          </NavLink>
                        ))}
                        <hr className="my-1 border-sand-200 dark:border-earth-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          role="menuitem"
                        >
                          {t.nav.logout}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <NavLink to="/connexion" className="btn-ghost text-sm px-3 py-2">
                    {t.nav.login}
                  </NavLink>
                  <NavLink to="/inscription" className="btn-primary text-sm px-4 py-2">
                    {t.nav.register}
                  </NavLink>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="lg:hidden btn-ghost p-2 ml-1"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-earth-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-earth-950 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Logo size="sm" />
                  <button onClick={() => setMobileOpen(false)} className="btn-ghost p-2" aria-label="Fermer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 mb-8">
                  {navLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === '/'}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400'
                            : 'text-earth-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-earth-900'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="space-y-3 pt-6 border-t border-sand-200 dark:border-earth-800">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <img src={user.avatar} alt={user.firstName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-earth-900 dark:text-sand-100">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-earth-500">{user.email}</p>
                        </div>
                      </div>
                      {[
                        { to: '/profil', label: t.nav.profile },
                        { to: '/commandes', label: t.nav.orders },
                        { to: '/favoris', label: t.nav.wishlist },
                      ].map(item => (
                        <NavLink key={item.to} to={item.to} onClick={() => setMobileOpen(false)} className="block btn-ghost w-full text-left">
                          {item.label}
                        </NavLink>
                      ))}
                      <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="w-full text-left px-4 py-2 text-red-500 font-medium">
                        {t.nav.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/connexion" onClick={() => setMobileOpen(false)} className="btn-outline w-full">
                        {t.nav.login}
                      </NavLink>
                      <NavLink to="/inscription" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                        {t.nav.register}
                      </NavLink>
                    </>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <button onClick={() => switchLang(lang === 'fr' ? 'en' : 'fr')} className="btn-ghost text-sm font-bold uppercase">
                      {lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
                    </button>
                    <button onClick={toggleTheme} className="btn-ghost p-2">
                      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer — s'adapte selon la présence du bandeau promo */}
      <div className={showBanner ? 'h-24' : 'h-16'} />

      {/* Click outside user menu */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  )
}
