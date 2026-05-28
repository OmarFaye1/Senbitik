import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Login() {
  const { t, lang } = useLanguage()
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('demo@senbitik.com')
  const [password, setPassword] = useState('demo1234')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const loggedUser = await login(email, password)
      toast.success(t.auth.loginSuccess)
      // Rediriger l'admin directement sur son tableau de bord
      if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="min-h-screen flex">
      {/* Left panel — image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80"
          alt="Artisanat local"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-earth-950/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <Logo size="lg" white />
          <p className="text-white/80 text-xl mt-6 max-w-sm leading-relaxed font-serif italic">
            {lang === 'fr'
              ? '"Chaque achat soutient un artisan, une famille, un savoir-faire."'
              : '"Every purchase supports an artisan, a family, a craft."'}
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-earth-950">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-2">
            {t.auth.login}
          </h1>
          <p className="text-earth-500 text-sm mb-8">
            {t.auth.noAccount}{' '}
            <Link to="/inscription" className="text-primary-500 font-semibold hover:underline">
              {t.auth.register}
            </Link>
          </p>

          {/* Demo hint */}
          <div className="bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800 rounded-xl p-3 mb-6 text-xs text-primary-700 dark:text-primary-300">
            🔑 {lang === 'fr' ? 'Compte démo pré-rempli. Cliquez simplement sur "Connexion".' : 'Pre-filled demo account. Just click "Log In".'}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-6 text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">
                {t.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="input-field pl-9"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">
                {t.auth.password}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="input-field pl-9 pr-9"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/mot-de-passe-oublie" className="text-xs text-primary-500 hover:underline">
                {t.auth.forgotPassword}
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {lang === 'fr' ? 'Connexion...' : 'Signing in...'}
                </span>
              ) : t.auth.login}
            </button>
          </form>

          <p className="text-center text-xs text-earth-400 mt-8">
            {lang === 'fr' ? 'En vous connectant, vous acceptez nos' : 'By signing in, you accept our'}{' '}
            <Link to="/cgv" className="underline hover:text-primary-500">{t.footer.cgv}</Link>
            {' '}{lang === 'fr' ? 'et notre' : 'and our'}{' '}
            <Link to="/mentions-legales" className="underline hover:text-primary-500">{lang === 'fr' ? 'Politique de confidentialité' : 'Privacy Policy'}</Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
