import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

export default function Register() {
  const { t, lang } = useLanguage()
  const { register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/" replace />

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError(lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match')
    }
    if (form.password.length < 8) {
      return setError(lang === 'fr' ? 'Mot de passe trop court (min. 8 caractères)' : 'Password too short (min. 8 characters)')
    }
    try {
      await register({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName })
      toast.success(t.auth.registerSuccess)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=1200&q=80"
          alt="Épices locales"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/80 to-earth-950/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <Logo size="lg" white />
          <p className="text-white/80 text-xl mt-6 max-w-sm leading-relaxed font-serif italic">
            {lang === 'fr'
              ? '"Rejoignez une communauté qui valorise l\'authenticité et le savoir-faire local."'
              : '"Join a community that values authenticity and local craftsmanship."'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-earth-950 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-2">
            {t.auth.register}
          </h1>
          <p className="text-earth-500 text-sm mb-8">
            {t.auth.hasAccount}{' '}
            <Link to="/connexion" className="text-primary-500 font-semibold hover:underline">
              {t.auth.login}
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4 text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.firstName}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                  <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} required className="input-field pl-9" placeholder="Amadou" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.lastName}</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} required className="input-field" placeholder="Coulibaly" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.email}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="input-field pl-9" placeholder="email@exemple.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                  className="input-field pl-9 pr-9"
                  placeholder="Min. 8 caractères"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div className="mt-1.5 flex gap-1">
                  {[8, 12, 16].map((min, i) => (
                    <div key={min} className={`h-1 flex-1 rounded-full transition-colors ${
                      form.password.length >= min
                        ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-orange-400' : 'bg-green-500'
                        : 'bg-sand-200 dark:bg-earth-700'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => update('confirm', e.target.value)}
                  required
                  className={`input-field pl-9 ${form.confirm && form.confirm !== form.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="Répétez le mot de passe"
                />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">{lang === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match'}</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {lang === 'fr' ? 'Création...' : 'Creating...'}
                </span>
              ) : t.auth.register}
            </button>
          </form>

          <p className="text-center text-xs text-earth-400 mt-6">
            {lang === 'fr' ? 'En créant un compte, vous acceptez nos ' : 'By creating an account, you accept our '}
            <Link to="/cgv" className="underline hover:text-primary-500">{t.footer.cgv}</Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
