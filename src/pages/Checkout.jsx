import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, CreditCard, Lock, MapPin, Package } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { formatPrice, generateOrderId } from '../utils'

const STEPS = ['address', 'payment', 'confirmation']

export default function Checkout() {
  const { lang, t } = useLanguage()
  const { items, subtotal, shipping, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const [address, setAddress] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    city: user?.address?.city || '',
    quartier: user?.address?.street || '',
  })
  const [payment, setPayment] = useState({ method: 'wave', phone: '', reference: '' })

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const id = generateOrderId()
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id,
          customer: { firstName: address.firstName, lastName: address.lastName, phone: address.phone },
          address: { city: address.city, quartier: address.quartier },
          payment: { method: payment.method },
          items,
          subtotal,
          shipping,
          total,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Erreur serveur')
      }
    } catch (err) {
      setLoading(false)
      toast.error(
        lang === 'fr'
          ? `Impossible d'enregistrer la commande : ${err.message}`
          : `Could not place order: ${err.message}`
      )
      return
    }
    setOrderId(id)
    clearCart()
    setStep(2)
    setLoading(false)
    window.scrollTo(0, 0)
    toast.success(lang === 'fr' ? 'Commande confirmée !' : 'Order confirmed!')
  }

  const stepLabels = {
    fr: ['Adresse', 'Paiement', 'Confirmation'],
    en: ['Address', 'Payment', 'Confirmation'],
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">{lang === 'fr' ? 'Passer commande' : 'Checkout'}</h1>

      {/* Bannière invité — suggestion douce de connexion */}
      {!user && step < 2 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-sand-100 dark:bg-earth-800 border border-sand-200 dark:border-earth-700">
          <span className="text-xl">👋</span>
          <p className="text-sm text-earth-600 dark:text-earth-300 flex-1">
            {lang === 'fr'
              ? 'Vous commandez en tant qu\'invité. '
              : 'You are ordering as a guest. '}
            <Link to="/connexion" state={{ from: { pathname: '/commande' } }} className="text-primary-500 hover:underline font-semibold">
              {lang === 'fr' ? 'Se connecter' : 'Sign in'}
            </Link>
            {lang === 'fr' ? ' pour retrouver vos commandes facilement.' : ' to track your orders easily.'}
          </p>
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-primary-600 dark:text-primary-400' : 'text-earth-300 dark:text-earth-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                i < step ? 'bg-primary-500 border-primary-500 text-white'
                : i === step ? 'border-primary-500 text-primary-500'
                : 'border-earth-200 dark:border-earth-700 text-earth-400'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {stepLabels[lang]?.[i] || stepLabels.fr[i]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-3 transition-all ${i < step ? 'bg-primary-500' : 'bg-sand-200 dark:bg-earth-800'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* STEP 0 — ADDRESS */}
            {step === 0 && (
              <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handleAddressSubmit} className="card p-6 space-y-5">
                  <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    {lang === 'fr' ? 'Adresse de livraison' : 'Delivery address'}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.firstName} *</label>
                      <input value={address.firstName} onChange={e => setAddress(a => ({ ...a, firstName: e.target.value }))} required className="input-field" placeholder="Amadou" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{t.auth.lastName} *</label>
                      <input value={address.lastName} onChange={e => setAddress(a => ({ ...a, lastName: e.target.value }))} required className="input-field" placeholder="Sarr" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">
                      {lang === 'fr' ? 'Téléphone (WhatsApp de préférence)' : 'Phone (WhatsApp preferred)'} *
                    </label>
                    <input type="tel" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required className="input-field" placeholder="+221 7X XXX XX XX" />
                    <p className="text-xs text-earth-400 mt-1">{lang === 'fr' ? 'Le livreur vous contactera sur ce numéro' : 'The delivery person will contact you on this number'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Ville' : 'City'} *</label>
                    <select value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required className="input-field cursor-pointer">
                      <option value="">{lang === 'fr' ? '— Choisir votre ville —' : '— Choose your city —'}</option>
                      {['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Touba', 'Mbour', 'Rufisque', 'Pikine', 'Guédiawaye', 'Tambacounda', 'Kolda', 'Diourbel', 'Fatick', 'Kédougou', 'Sédhiou', 'Matam', 'Louga'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Quartier / Point de repère' : 'Neighborhood / Landmark'}</label>
                    <input value={address.quartier} onChange={e => setAddress(a => ({ ...a, quartier: e.target.value }))} className="input-field" placeholder={lang === 'fr' ? 'Ex: Almadies, près de la pharmacie...' : 'Ex: Almadies, near the pharmacy...'} />
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5">
                    {lang === 'fr' ? 'Continuer vers le paiement' : 'Continue to payment'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 1 — PAYMENT */}
            {step === 1 && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form onSubmit={handlePaymentSubmit} className="card p-6 space-y-6">
                  <h2 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-500" />
                    {lang === 'fr' ? 'Méthode de paiement' : 'Payment method'}
                  </h2>

                  {/* Paiement en ligne — Wave uniquement */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-earth-500 dark:text-earth-400 uppercase tracking-wider px-1">
                      {lang === 'fr' ? 'Paiement en ligne' : 'Online payment'}
                    </p>
                    <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      payment.method === 'wave'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                        : 'border-sand-200 dark:border-earth-700 hover:border-primary-200'
                    }`}>
                      <input type="radio" name="payment" value="wave" checked={payment.method === 'wave'} onChange={() => setPayment(p => ({ ...p, method: 'wave' }))} className="accent-primary-500" />
                      <span className="text-2xl">🌊</span>
                      <div>
                        <span className="font-semibold text-earth-800 dark:text-sand-200 block">Wave</span>
                        <span className="text-xs text-earth-400">
                          {lang === 'fr' ? 'Paiement instantané via Wave' : 'Instant payment via Wave'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Séparateur */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-sand-200 dark:bg-earth-700" />
                    <span className="text-xs text-earth-400">{lang === 'fr' ? 'ou' : 'or'}</span>
                    <div className="flex-1 h-px bg-sand-200 dark:bg-earth-700" />
                  </div>

                  {/* Paiement à la livraison — mis en avant */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    payment.method === 'cash'
                      ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-950/30'
                      : 'border-secondary-200 dark:border-secondary-900 hover:border-secondary-400 bg-secondary-50/50 dark:bg-secondary-950/10'
                  }`}>
                    <input type="radio" name="payment" value="cash" checked={payment.method === 'cash'} onChange={() => setPayment(p => ({ ...p, method: 'cash' }))} className="accent-secondary-500" />
                    <span className="text-2xl">💵</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-secondary-700 dark:text-secondary-400">
                          {lang === 'fr' ? 'Paiement à la livraison' : 'Cash on delivery'}
                        </span>
                        <span className="text-xs bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 px-2 py-0.5 rounded-full font-medium">
                          {lang === 'fr' ? 'Aucun paiement maintenant' : 'No payment now'}
                        </span>
                      </div>
                      <span className="text-xs text-earth-500">
                        {lang === 'fr'
                          ? 'Payez en espèces au livreur · Disponible partout au Sénégal'
                          : 'Pay cash to the delivery person · Available across Senegal'}
                      </span>
                    </div>
                  </label>

                  {/* Info paiement à la livraison */}
                  {payment.method === 'cash' && (
                    <div className="p-4 bg-secondary-50 dark:bg-secondary-950/20 rounded-xl border border-secondary-200 dark:border-secondary-900 text-sm text-secondary-700 dark:text-secondary-400">
                      <p className="font-semibold mb-1">
                        {lang === 'fr' ? '✅ Aucun paiement en avance requis' : '✅ No upfront payment required'}
                      </p>
                      <p className="text-xs leading-relaxed">
                        {lang === 'fr'
                          ? 'Vous payez uniquement en espèces au moment de la réception de votre colis. Le livreur vous contactera avant la livraison.'
                          : 'You only pay in cash when you receive your parcel. The delivery person will contact you before delivery.'}
                      </p>
                    </div>
                  )}

                  {payment.method === 'wave' && (
                    <div className="space-y-3 p-4 bg-sand-50 dark:bg-earth-900 rounded-xl">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          {lang === 'fr' ? 'Numéro Wave *' : 'Wave number *'}
                        </label>
                        <input
                          type="tel"
                          value={payment.phone}
                          onChange={e => setPayment(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+221 7X XXX XX XX"
                          required
                          className="input-field"
                        />
                      </div>
                      <p className="text-xs text-earth-500 bg-primary-50 dark:bg-primary-950 rounded-lg p-3">
                        {lang === 'fr'
                          ? '💡 Pour la démo : entrez n\'importe quel numéro. En production, vous recevrez une confirmation par SMS.'
                          : '💡 For demo: enter any number. In production, you will receive an SMS confirmation.'}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1">
                      {t.common.cancel}
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 py-3.5">
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {lang === 'fr' ? 'Traitement...' : 'Processing...'}
                        </span>
                      ) : payment.method === 'cash' ? (
                        <>
                          <Package className="w-4 h-4" />
                          {lang === 'fr' ? 'Confirmer la commande' : 'Confirm order'}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          {lang === 'fr' ? `Payer ${formatPrice(total)}` : `Pay ${formatPrice(total)}`}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2 — CONFIRMATION */}
            {step === 2 && (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="card p-8 text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto"
                  >
                    <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>

                  <div>
                    <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-sand-100 mb-2">
                      {lang === 'fr' ? 'Commande confirmée !' : 'Order confirmed!'}
                    </h2>
                    <p className="text-earth-500">
                      {lang === 'fr' ? 'Merci pour votre commande chez Senbitik' : 'Thank you for your order at Senbitik'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sand-50 dark:bg-earth-900 text-left space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-500">{lang === 'fr' ? 'N° de commande' : 'Order ID'}</span>
                      <span className="font-bold text-primary-600 font-mono">{orderId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-500">{lang === 'fr' ? 'Livraison à' : 'Deliver to'}</span>
                      <span className="font-medium text-earth-800 dark:text-sand-200">{address.city}{address.quartier ? ` — ${address.quartier}` : ''}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-500">{lang === 'fr' ? 'Paiement' : 'Payment'}</span>
                      <span className="badge-secondary">{lang === 'fr' ? 'Confirmé' : 'Confirmed'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-earth-500">{lang === 'fr' ? 'Livraison estimée' : 'Estimated delivery'}</span>
                      <span className="font-medium text-earth-800 dark:text-sand-200">
                        {lang === 'fr'
                        ? (address.city === 'Dakar' || address.city === 'Pikine' || address.city === 'Guédiawaye' || address.city === 'Rufisque' ? '24-48h' : '3-5 jours ouvrés')
                        : (address.city === 'Dakar' || address.city === 'Pikine' || address.city === 'Guédiawaye' || address.city === 'Rufisque' ? '24-48h' : '3-5 business days')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-secondary-50 dark:bg-secondary-950/30 rounded-xl">
                    <Package className="w-5 h-5 text-secondary-600" />
                    <p className="text-sm text-secondary-700 dark:text-secondary-300">
                      {lang === 'fr'
                        ? `Le livreur vous contactera au ${address.phone || '—'} pour coordonner la livraison.`
                        : `The delivery person will contact you at ${address.phone || '—'} to coordinate delivery.`}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link to="/commandes" className="btn-outline flex-1">
                      {t.nav.orders}
                    </Link>
                    <Link to="/boutique" className="btn-primary flex-1">
                      {lang === 'fr' ? 'Continuer mes achats' : 'Continue shopping'}
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        {step < 2 && (
          <div className="card p-5 h-fit sticky top-24">
            <h3 className="font-serif font-bold text-earth-900 dark:text-sand-100 mb-4">
              {lang === 'fr' ? 'Récapitulatif' : 'Summary'} ({items.length} {t.cart.items})
            </h3>
            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 items-start">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-earth-800 dark:text-sand-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-earth-400">×{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600 flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-sand-200 dark:border-earth-800 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-earth-500"><span>{t.cart.subtotal}</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-earth-500"><span>{t.cart.shipping}</span><span>{shipping === 0 ? t.cart.shippingFree : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-earth-900 dark:text-sand-100 pt-1 border-t border-sand-200 dark:border-earth-800">
                <span>{t.cart.total}</span>
                <span className="price-tag">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-earth-400">
              <Lock className="w-3 h-3" />
              {lang === 'fr' ? 'Paiement sécurisé SSL' : 'SSL secured payment'}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
