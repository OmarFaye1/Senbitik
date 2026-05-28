import { motion } from 'framer-motion'
import { Camera, Heart, Package, Save, Settings, User } from 'lucide-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { products } from '../data/products'
import { useWishlist } from '../hooks/useWishlist'
import ProductCard from '../components/ProductCard'

export default function Profile() {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const { lang } = useLanguage()
  const { wishlist } = useWishlist()

  const [activeTab, setActiveTab] = useState('info')
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  if (!isAuthenticated) return <Navigate to="/connexion" replace />

  const wishlistProducts = products.filter(p => wishlist.includes(p.id))

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(form)
    toast.success(lang === 'fr' ? 'Profil mis à jour !' : 'Profile updated!')
  }

  const tabs = [
    { id: 'info', icon: User, label: lang === 'fr' ? 'Informations' : 'Information' },
    { id: 'wishlist', icon: Heart, label: lang === 'fr' ? `Favoris (${wishlist.length})` : `Wishlist (${wishlist.length})` },
    { id: 'settings', icon: Settings, label: lang === 'fr' ? 'Paramètres' : 'Settings' },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.firstName}
            className="w-20 h-20 rounded-2xl object-cover shadow"
          />
          <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-warm hover:bg-primary-600 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="font-serif text-2xl font-bold text-earth-900 dark:text-sand-100">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-earth-500 text-sm">{user.email}</p>
          <span className="badge-primary text-xs mt-2 inline-block capitalize">{user.role}</span>
        </div>
        <div className="sm:ml-auto flex gap-4 text-center">
          <div>
            <div className="font-bold text-2xl text-primary-600">{wishlist.length}</div>
            <div className="text-xs text-earth-400">{lang === 'fr' ? 'Favoris' : 'Wishlist'}</div>
          </div>
          <div>
            <div className="font-bold text-2xl text-secondary-600">3</div>
            <div className="text-xs text-earth-400">{lang === 'fr' ? 'Commandes' : 'Orders'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-200 dark:border-earth-800 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-earth-500 hover:text-earth-700 dark:hover:text-earth-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="card p-6 space-y-5 max-w-lg"
        >
          <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100">
            {lang === 'fr' ? 'Informations personnelles' : 'Personal information'}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Prénom' : 'First name'}</label>
              <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Nom' : 'Last name'}</label>
              <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="input-field" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Téléphone' : 'Phone'}</label>
            <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+223 XX XX XX XX" />
          </div>
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            {lang === 'fr' ? 'Sauvegarder' : 'Save'}
          </button>
        </motion.form>
      )}

      {activeTab === 'wishlist' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-earth-200 dark:text-earth-700 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-earth-700 dark:text-sand-300 mb-2">
                {lang === 'fr' ? 'Aucun favori' : 'No favorites yet'}
              </h3>
              <p className="text-earth-400 mb-6">
                {lang === 'fr' ? 'Ajoutez des produits à vos favoris depuis la boutique.' : 'Add products to your wishlist from the shop.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 max-w-lg space-y-6">
          <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100">
            {lang === 'fr' ? 'Paramètres du compte' : 'Account settings'}
          </h2>
          <div className="space-y-4">
            {[
              { label: lang === 'fr' ? 'Notifications par email' : 'Email notifications', defaultChecked: true },
              { label: lang === 'fr' ? 'Offres et promotions' : 'Offers and promotions', defaultChecked: true },
              { label: lang === 'fr' ? 'Nouveaux produits' : 'New products', defaultChecked: false },
            ].map((setting, i) => (
              <label key={i} className="flex items-center justify-between py-3 border-b border-sand-100 dark:border-earth-800 cursor-pointer">
                <span className="text-sm text-earth-700 dark:text-earth-300">{setting.label}</span>
                <input type="checkbox" defaultChecked={setting.defaultChecked} className="w-5 h-5 accent-primary-500 rounded" />
              </label>
            ))}
          </div>
          <button type="button" className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
            {lang === 'fr' ? 'Supprimer mon compte' : 'Delete my account'}
          </button>
        </motion.div>
      )}
    </main>
  )
}
