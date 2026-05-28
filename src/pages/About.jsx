import { motion } from 'framer-motion'
import { Award, Globe, Heart, Leaf, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Newsletter from '../components/Newsletter'
import { useLanguage } from '../context/LanguageContext'

export default function About() {
  const { lang } = useLanguage()

  const values = [
    { icon: Heart, title: lang === 'fr' ? 'Authenticité' : 'Authenticity', desc: lang === 'fr' ? 'Nous sélectionnons uniquement des produits authentiques, fabriqués selon des méthodes traditionnelles.' : 'We select only authentic products made according to traditional methods.' },
    { icon: Leaf, title: lang === 'fr' ? 'Durabilité' : 'Sustainability', desc: lang === 'fr' ? 'Tous nos produits sont écologiques et respectueux de l\'environnement.' : 'All our products are ecological and environmentally friendly.' },
    { icon: Users, title: lang === 'fr' ? 'Communauté' : 'Community', desc: lang === 'fr' ? 'Nous construisons des ponts entre producteurs locaux et consommateurs du monde entier.' : 'We build bridges between local producers and consumers worldwide.' },
    { icon: Award, title: lang === 'fr' ? 'Qualité' : 'Quality', desc: lang === 'fr' ? 'Chaque produit est soigneusement contrôlé pour garantir les plus hauts standards.' : 'Each product is carefully controlled to guarantee the highest standards.' },
    { icon: Globe, title: lang === 'fr' ? 'Impact mondial' : 'Global impact', desc: lang === 'fr' ? 'Présents dans 12 régions, nous permettons au terroir africain de rayonner partout.' : 'Present in 12 regions, we let African terroir shine everywhere.' },
    { icon: Target, title: lang === 'fr' ? 'Mission' : 'Mission', desc: lang === 'fr' ? 'Valoriser les producteurs locaux et rendre leurs produits accessibles à tous.' : 'Empower local producers and make their products accessible to all.' },
  ]

  const team = [
    { name: 'Fatou Sarr', role: lang === 'fr' ? 'CEO & Co-fondatrice' : 'CEO & Co-founder', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80', bio: lang === 'fr' ? 'Dakaroise passionnée de Teranga, Fatou a fondé Senbitik pour valoriser les artisans sénégalais.' : 'A Dakar native passionate about Teranga, Fatou founded Senbitik to champion Senegalese artisans.' },
    { name: 'Mamadou Diallo', role: lang === 'fr' ? 'CTO & Co-fondateur' : 'CTO & Co-founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: lang === 'fr' ? 'Ingénieur diplômé de l\'ESP Dakar, Mamadou construit la plateforme qui connecte producteurs et clients.' : 'Graduate engineer from ESP Dakar, Mamadou builds the platform connecting producers and customers.' },
    { name: 'Aminata Ndiaye', role: lang === 'fr' ? 'Directrice Partenariats' : 'Head of Partnerships', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', bio: lang === 'fr' ? 'Avec 10 ans en développement rural au Sénégal, Aminata sélectionne et accompagne nos meilleurs producteurs.' : 'With 10 years in rural development in Senegal, Aminata selects and supports our best producers.' },
  ]

  return (
    <main>
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1400&q=80" alt="À propos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-earth-950/85 via-primary-950/70 to-earth-950/80" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-semibold mb-6"
          >
            {lang === 'fr' ? '🌿 Notre histoire' : '🌿 Our story'}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            {lang === 'fr' ? 'À Propos de Senbitik' : 'About Senbitik'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto"
          >
            {lang === 'fr'
              ? "Senbitik est née d'une conviction simple : les trésors de l'Afrique méritent d'être partagés avec le monde entier."
              : "Senbitik was born from a simple conviction: Africa's treasures deserve to be shared with the entire world."}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-6">
              {lang === 'fr' ? "L'histoire de Senbitik" : "Senbitik's story"}
            </h2>
            <div className="space-y-4 text-earth-600 dark:text-earth-300 leading-relaxed">
              <p>
                {lang === 'fr'
                  ? "Fondée en 2020 à Dakar, Senbitik (qui signifie « notre héritage » en Wolof) est une plateforme e-commerce dédiée aux produits locaux sénégalais et africains."
                  : "Founded in 2020 in Dakar, Senbitik (meaning \"our heritage\" in Wolof) is an e-commerce platform dedicated to Senegalese and African local products."}
              </p>
              <p>
                {lang === 'fr'
                  ? "Notre mission est double : permettre aux artisans et producteurs locaux d'accéder à des marchés plus larges, tout en offrant aux consommateurs des produits authentiques de qualité exceptionnelle."
                  : "Our mission is twofold: allow local artisans and producers to access larger markets, while offering consumers authentic products of exceptional quality."}
              </p>
              <p>
                {lang === 'fr'
                  ? "Aujourd'hui, nous collaborons avec plus de 50 producteurs dans 12 régions, et livrons dans le monde entier. Chaque achat sur Senbitik soutient directement une famille et préserve un savoir-faire ancestral."
                  : "Today, we collaborate with more than 50 producers across 12 regions, and deliver worldwide. Every purchase on Senbitik directly supports a family and preserves an ancestral craft."}
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <img src="https://images.unsplash.com/photo-1558171813-1e46e59b765b?w=400&q=80" alt="" className="rounded-2xl h-48 object-cover" />
            <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80" alt="" className="rounded-2xl h-48 object-cover mt-8" />
            <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80" alt="" className="rounded-2xl h-48 object-cover" />
            <img src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&q=80" alt="" className="rounded-2xl h-48 object-cover mt-8" />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-sand-50 dark:bg-earth-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-4">
              {lang === 'fr' ? 'Nos valeurs' : 'Our values'}
            </h2>
            <p className="text-earth-500 text-lg">
              {lang === 'fr' ? 'Les principes qui guident chaque décision chez Senbitik' : 'The principles guiding every decision at Senbitik'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="font-serif font-bold text-earth-900 dark:text-sand-100 text-lg mb-2">{v.title}</h3>
                <p className="text-earth-500 dark:text-earth-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-earth-900 dark:text-sand-100 mb-4">
              {lang === 'fr' ? "L'équipe" : 'The team'}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-warm" />
                <h3 className="font-serif font-bold text-earth-900 dark:text-sand-100">{member.name}</h3>
                <p className="text-primary-500 text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-earth-500 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center bg-gradient-to-br from-primary-500 to-earth-800">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            {lang === 'fr' ? 'Rejoignez l\'aventure Senbitik' : 'Join the Senbitik adventure'}
          </h2>
          <p className="text-white/80 mb-8">
            {lang === 'fr' ? 'Découvrez nos produits et soutenez des producteurs locaux passionnés.' : 'Discover our products and support passionate local producers.'}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/boutique" className="px-6 py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-sand-100 transition-colors">
              {lang === 'fr' ? 'Explorer la boutique' : 'Explore the shop'}
            </Link>
            <Link to="/contact" className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors">
              {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  )
}
