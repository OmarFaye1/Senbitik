import { motion } from 'framer-motion'
import { CheckCircle, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { lang } = useLanguage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
    toast.success(lang === 'fr' ? 'Message envoyé ! Nous vous répondrons sous 24h.' : 'Message sent! We\'ll reply within 24h.')
  }

  const contacts = [
    { icon: Mail, title: 'Email', value: 'contactsenbitik@gmail.com', href: 'mailto:contactsenbitik@gmail.com' },
    { icon: Phone, title: lang === 'fr' ? 'Téléphone' : 'Phone', value: '+221 76 396 16 32', href: 'tel:+221763961632' },
    { icon: MapPin, title: lang === 'fr' ? 'Adresse' : 'Address', value: 'Dakar, Sénégal — Almadies, Route de la Corniche', href: null },
    { icon: MessageCircle, title: 'WhatsApp', value: '+221 76 396 16 32', href: 'https://wa.me/221763961632' },
  ]

  return (
    <main>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl font-bold text-earth-900 dark:text-sand-100 mb-4"
            >
              {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
            </motion.h1>
            <p className="text-earth-500 text-lg">
              {lang === 'fr' ? "Nous répondons à toutes les demandes sous 24 heures ouvrées." : "We respond to all inquiries within 24 business hours."}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-sand-100">
                {lang === 'fr' ? 'Nos coordonnées' : 'Our contact details'}
              </h2>
              {contacts.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-earth-700 dark:text-sand-300">{c.title}</p>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-primary-500 hover:underline text-sm">
                        {c.value}
                      </a>
                    ) : (
                      <p className="text-earth-600 dark:text-earth-300 text-sm">{c.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden h-48 bg-sand-100 dark:bg-earth-800 flex items-center justify-center">
                <div className="text-center text-earth-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{lang === 'fr' ? 'Dakar, Sénégal' : 'Dakar, Senegal'}</p>
                  <p className="text-xs">Almadies, Route de la Corniche</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card p-10 text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-earth-900 dark:text-sand-100 mb-2">
                    {lang === 'fr' ? 'Message envoyé !' : 'Message sent!'}
                  </h3>
                  <p className="text-earth-500">
                    {lang === 'fr'
                      ? "Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais."
                      : "Thank you for your message. Our team will get back to you as soon as possible."}
                  </p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }} className="btn-outline mt-6">
                    {lang === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="card p-8 space-y-5"
                >
                  <h2 className="font-serif text-2xl font-bold text-earth-900 dark:text-sand-100">
                    {lang === 'fr' ? 'Envoyer un message' : 'Send a message'}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Nom complet *' : 'Full name *'}</label>
                      <input value={form.name} onChange={e => update('name', e.target.value)} required className="input-field" placeholder="Amadou Sarr" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="input-field" placeholder="email@exemple.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Sujet *' : 'Subject *'}</label>
                    <select value={form.subject} onChange={e => update('subject', e.target.value)} required className="input-field cursor-pointer">
                      <option value="">{lang === 'fr' ? '— Choisir un sujet —' : '— Choose a subject —'}</option>
                      <option>{lang === 'fr' ? 'Question sur un produit' : 'Product question'}</option>
                      <option>{lang === 'fr' ? 'Problème de commande' : 'Order issue'}</option>
                      <option>{lang === 'fr' ? 'Devenir producteur partenaire' : 'Become a producer partner'}</option>
                      <option>{lang === 'fr' ? 'Presse / Partenariat média' : 'Press / Media partnership'}</option>
                      <option>{lang === 'fr' ? 'Autre demande' : 'Other inquiry'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-earth-700 dark:text-sand-300 mb-1.5">{lang === 'fr' ? 'Message *' : 'Message *'}</label>
                    <textarea
                      value={form.message}
                      onChange={e => update('message', e.target.value)}
                      required
                      rows={6}
                      className="input-field resize-none"
                      placeholder={lang === 'fr' ? 'Décrivez votre demande en détail...' : 'Describe your request in detail...'}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                    {loading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {lang === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {lang === 'fr' ? 'Envoyer le message' : 'Send message'}
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
