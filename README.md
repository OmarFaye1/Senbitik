# Natamansa — Le terroir à portée de clic

Plateforme e-commerce dédiée aux produits locaux africains : artisanat, alimentation, textile et cosmétiques naturels.

## Présentation

**Natamansa** (qui signifie "ce qui appartient au peuple" en Bambara) est une application web e-commerce complète valorisant les produits du terroir et les producteurs locaux africains. La plateforme connecte des artisans, agriculteurs et producteurs locaux avec des consommateurs du monde entier.

## Stack Technique

| Technologie | Usage |
|---|---|
| React 18 + Vite | Framework & bundler |
| React Router v6 | Routing côté client |
| Tailwind CSS 3 | Styles & design system |
| Framer Motion | Animations |
| Lucide React | Icônes |
| Sonner | Notifications toast |
| Context API | Gestion d'état (Auth, Cart, Theme, Lang) |

## Installation

```bash
# Cloner le dépôt
git clone <repo-url>
cd natamansa

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

L'application démarre sur **http://localhost:3000**

## Compte démo

| Champ | Valeur |
|---|---|
| Email | `demo@natamansa.com` |
| Mot de passe | `demo1234` |

## Structure du Projet

```
natamansa/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── Logo.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProducerCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── TestimonialCard.jsx
│   │   ├── StarRating.jsx
│   │   ├── Skeleton.jsx
│   │   └── Newsletter.jsx
│   ├── context/            # Gestion d'état globale
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── LanguageContext.jsx
│   ├── data/               # Données mock
│   │   ├── products.js     # 22 produits
│   │   ├── categories.js   # 5 catégories
│   │   ├── producers.js    # 5 producteurs
│   │   └── testimonials.js # 5 témoignages
│   ├── hooks/
│   │   └── useWishlist.js
│   ├── pages/
│   │   ├── Home.jsx        # Page d'accueil
│   │   ├── Shop.jsx        # Catalogue avec filtres
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx    # Paiement multi-étapes
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx     # Profil + favoris
│   │   ├── Orders.jsx
│   │   ├── Producers.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── FAQ.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   └── index.js        # formatPrice, formatDate, etc.
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── postcss.config.js
```

## Fonctionnalités

- **Accueil** : Hero, produits vedettes, catégories, producteurs, témoignages, newsletter
- **Boutique** : Grille, filtres (catégorie, prix, producteur, note), recherche, tri, pagination
- **Produit** : Galerie, description, onglets, produits similaires, ajout au panier
- **Panier** : Drawer latéral + page dédiée, codes promo (NATAMANSA10, BIENVENUE, TERROIR)
- **Checkout** : Adresse → Paiement → Confirmation (3 étapes)
- **Auth** : Login/Register avec compte démo pré-rempli
- **Profil** : Édition, favoris/wishlist, paramètres
- **Commandes** : Historique avec détails accordéon
- **Producteurs** : Fiches détaillées, spotlight du mois
- **À propos / Contact / FAQ** : Pages institutionnelles complètes
- **Mode sombre/clair** : Basculement avec persistance
- **Multilingue FR/EN** : Toute l'interface traduite
- **Responsive** : Mobile-first, optimisé tablette et desktop

## Déploiement

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Glisser le dossier dist/ sur netlify.com
```

### Variables d'environnement (pour un backend réel)

```env
VITE_API_URL=https://api.natamansa.com
VITE_STRIPE_PUBLIC_KEY=pk_live_...
VITE_CLOUDINARY_CLOUD_NAME=natamansa
```

## Données Mock

- **22 produits** répartis en 5 catégories
- **5 producteurs** avec histoire, certifications et galerie
- **5 catégories** : Artisanat, Alimentation, Textile, Cosmétiques, Décoration
- **5 témoignages** clients internationaux

## Palette de Couleurs

| Couleur | Hex | Usage |
|---|---|---|
| Terre cuite | `#C4603B` | Couleur principale |
| Vert nature | `#4A7C59` | Couleur secondaire |
| Or | `#D4AF37` | Accent / étoiles |
| Beige sable | `#F5E6D3` | Fond clair |
| Brun terre | `#3D1F0D` | Texte / fond sombre |

## Licence

MIT © 2024 Natamansa
