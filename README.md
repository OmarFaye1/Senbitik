# Senbitik — Le terroir à portée de clic

Plateforme e-commerce dédiée aux produits locaux sénégalais : artisanat, alimentation, textile et cosmétiques naturels.

## Stack Technique

| Technologie | Usage |
|---|---|
| React 18 + Vite | Framework & bundler |
| React Router v6 | Routing côté client |
| Tailwind CSS 3 | Styles & design system |
| Framer Motion | Animations |
| Node.js + Express | Backend API REST |
| MySQL 8 | Base de données |

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/OmarFaye1/Senbitik.git
cd Senbitik

# Frontend
npm install
npm run dev

# Backend
cd backend
cp .env.example .env   # remplir les variables
npm install
node server.js
```

Frontend : **http://localhost:3000** — Backend : **http://localhost:3001**

## Comptes

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@senbitik.com` | `admin1234` |
| Client | `client@senbitik.com` | `client1234` |

## Structure

```
senbitik/
├── src/
│   ├── components/     # Navbar, Footer, CartDrawer, ProductCard…
│   ├── context/        # Auth, Cart, Theme, Language
│   ├── pages/          # Home, Shop, Admin, Checkout…
│   └── data/           # Producteurs, catégories, témoignages
├── backend/
│   ├── routes/         # products, orders, admin, upload
│   ├── server.js
│   └── initDB.js
└── public/
```

## Fonctionnalités

- Boutique avec filtres, recherche, tri
- Prix unitaire & prix grossiste (≥ 10 unités, style Alibaba)
- Panier avec codes promo (SENBITIK10, BIENVENUE, TERROIR)
- Checkout invité ou connecté (Wave, Orange Money, Cash)
- Dashboard admin — produits, commandes, stats
- Mode sombre/clair, bilingue FR/EN
- Responsive mobile-first

## Variables d'environnement (backend/.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=natamansa_db
PORT=3001
ADMIN_SECRET=senbitik-admin-2024
```

## Licence

MIT © 2024 Senbitik
