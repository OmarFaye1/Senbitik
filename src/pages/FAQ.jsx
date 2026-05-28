import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const faqs = {
  fr: [
    {
      category: 'Commandes & Livraison',
      items: [
        { q: 'Quels sont les délais de livraison ?', a: 'Les délais varient de 3 à 7 jours ouvrés pour l\'Afrique de l\'Ouest, et de 7 à 14 jours pour le reste du monde. Une confirmation avec suivi est envoyée par email.' },
        { q: 'La livraison est-elle gratuite ?', a: 'La livraison est offerte pour toute commande supérieure à 50 000 FCFA. En dessous, des frais de 3 500 FCFA sont appliqués.' },
        { q: 'Puis-je modifier ou annuler ma commande ?', a: 'Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant la validation. Passé ce délai, contactez notre service client.' },
        { q: 'Livrez-vous à l\'international ?', a: 'Oui, nous livrons dans plus de 30 pays. Contactez-nous pour les destinations non listées.' },
      ],
    },
    {
      category: 'Produits & Qualité',
      items: [
        { q: 'Comment garantissez-vous l\'authenticité des produits ?', a: 'Chaque producteur est audité par notre équipe. Nous visitons les ateliers, vérifions les techniques et certifions les méthodes de production avant toute mise en vente.' },
        { q: 'Les produits sont-ils biologiques ?', a: 'Nos produits alimentaires et cosmétiques sont issus de l\'agriculture biologique ou raisonnée. Les certifications sont indiquées sur chaque fiche produit.' },
        { q: 'Puis-je demander un produit personnalisé ?', a: 'Oui ! Certains de nos artisans acceptent des commandes personnalisées. Contactez-nous avec vos spécifications pour un devis.' },
      ],
    },
    {
      category: 'Paiement & Sécurité',
      items: [
        { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons les cartes bancaires (Visa/Mastercard), le Mobile Money (Orange Money, Moov Money, Wave) et le paiement à la livraison pour certaines zones.' },
        { q: 'Mes données bancaires sont-elles sécurisées ?', a: 'Oui, toutes les transactions sont chiffrées SSL. Nous ne stockons jamais vos données de carte bancaire sur nos serveurs.' },
        { q: 'Puis-je payer en plusieurs fois ?', a: 'Oui, le paiement en 3 fois sans frais est disponible pour les commandes supérieures à 30 000 FCFA.' },
      ],
    },
    {
      category: 'Retours & Remboursements',
      items: [
        { q: 'Quelle est votre politique de retour ?', a: 'Vous disposez de 30 jours après réception pour retourner un article non utilisé dans son emballage d\'origine. Les frais de retour sont à votre charge.' },
        { q: 'Comment procéder à un remboursement ?', a: 'Contactez notre service client avec votre numéro de commande. Le remboursement est traité sous 5 à 10 jours ouvrés.' },
        { q: 'Que faire si mon colis arrive endommagé ?', a: 'Photographiez le colis endommagé et contactez-nous dans les 48h. Nous envoyons un remplacement gratuit dans les meilleurs délais.' },
      ],
    },
  ],
  en: [
    {
      category: 'Orders & Delivery',
      items: [
        { q: 'What are the delivery times?', a: 'Delivery times range from 3 to 7 business days for West Africa, and 7 to 14 days for the rest of the world. A tracking confirmation is sent by email.' },
        { q: 'Is delivery free?', a: 'Delivery is free for orders over 50,000 XOF. Below that, a fee of 3,500 XOF applies.' },
        { q: 'Can I modify or cancel my order?', a: 'You can modify or cancel your order within 2 hours of validation. After that, contact our customer service.' },
        { q: 'Do you ship internationally?', a: 'Yes, we ship to more than 30 countries. Contact us for destinations not listed.' },
      ],
    },
    {
      category: 'Products & Quality',
      items: [
        { q: 'How do you guarantee product authenticity?', a: 'Each producer is audited by our team. We visit workshops, verify techniques and certify production methods before any listing.' },
        { q: 'Are the products organic?', a: 'Our food and cosmetic products come from organic or responsible farming. Certifications are shown on each product page.' },
        { q: 'Can I request a custom product?', a: 'Yes! Some of our artisans accept custom orders. Contact us with your specifications for a quote.' },
      ],
    },
    {
      category: 'Payment & Security',
      items: [
        { q: 'What payment methods do you accept?', a: 'We accept bank cards (Visa/Mastercard), Mobile Money (Orange Money, Moov Money, Wave) and cash on delivery for certain areas.' },
        { q: 'Is my payment data secure?', a: 'Yes, all transactions are SSL encrypted. We never store your card data on our servers.' },
        { q: 'Can I pay in installments?', a: 'Yes, 3-installment payment with no fees is available for orders over 30,000 XOF.' },
      ],
    },
    {
      category: 'Returns & Refunds',
      items: [
        { q: 'What is your return policy?', a: 'You have 30 days after receipt to return an unused item in its original packaging. Return shipping costs are your responsibility.' },
        { q: 'How do I get a refund?', a: 'Contact our customer service with your order number. Refunds are processed within 5 to 10 business days.' },
        { q: 'What if my package arrives damaged?', a: 'Photograph the damaged package and contact us within 48 hours. We send a free replacement as soon as possible.' },
      ],
    },
  ],
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-sand-200 dark:border-earth-800 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full py-4 flex items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className={`font-medium text-sm sm:text-base transition-colors ${open ? 'text-primary-600 dark:text-primary-400' : 'text-earth-800 dark:text-sand-200'}`}>
          {item.q}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-0.5">
          <ChevronDown className={`w-5 h-5 ${open ? 'text-primary-500' : 'text-earth-400'}`} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-earth-600 dark:text-earth-300 leading-relaxed pr-8">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { lang } = useLanguage()
  const data = faqs[lang] || faqs.fr
  const [activeCategory, setActiveCategory] = useState(data[0].category)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-earth-900 dark:text-sand-100 mb-4">
          {lang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-earth-500 text-lg">
          {lang === 'fr' ? "Toutes les réponses à vos questions sur Senbitik." : "All the answers to your questions about Senbitik."}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {data.map(cat => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.category
                ? 'bg-primary-500 text-white'
                : 'bg-sand-100 dark:bg-earth-800 text-earth-600 dark:text-earth-300 hover:bg-sand-200 dark:hover:bg-earth-700'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      {data.filter(cat => cat.category === activeCategory).map(cat => (
        <motion.div
          key={cat.category}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          {cat.items.map((item, i) => (
            <FAQItem key={i} item={item} />
          ))}
        </motion.div>
      ))}

      <div className="mt-10 text-center p-8 card">
        <h3 className="font-serif text-xl font-bold text-earth-900 dark:text-sand-100 mb-2">
          {lang === 'fr' ? 'Vous n\'avez pas trouvé votre réponse ?' : "Didn't find your answer?"}
        </h3>
        <p className="text-earth-500 mb-4">
          {lang === 'fr' ? 'Notre équipe est disponible 7j/7 pour vous aider.' : 'Our team is available 7 days a week to help you.'}
        </p>
        <Link to="/contact" className="btn-primary">
          {lang === 'fr' ? 'Contacter le support' : 'Contact support'}
        </Link>
      </div>
    </main>
  )
}
