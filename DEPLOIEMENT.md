# 🚀 Déploiement Senbitik sur Railway

Railway est recommandé : Node.js + MySQL hébergés ensemble, déploiement en quelques clics.

---

## Étape 1 — Préparer le code

1. Le dépôt GitHub est déjà créé : **https://github.com/OmarFaye1/Senbitik**
2. Pour pousser une mise à jour :
   ```bash
   git add .
   git commit -m "description"
   git push
   ```

---

## Étape 2 — Créer le projet sur Railway

1. Allez sur **https://railway.app** → créez un compte (gratuit)
2. **New Project** → **Deploy from GitHub repo** → sélectionnez `Senbitik`
3. Railway détecte automatiquement Node.js et utilise le `railway.toml`

---

## Étape 3 — Ajouter MySQL

1. Dans votre projet Railway, cliquez **+ New** → **Database** → **MySQL**
2. Railway crée la base et injecte automatiquement les variables :
   - `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`
3. **Les tables sont créées automatiquement au premier démarrage** (plus besoin de schema.sql)

---

## Étape 4 — Variables d'environnement

Dans Railway → onglet **Variables**, ajoutez :

| Variable | Valeur |
|---|---|
| `NODE_ENV` | `production` |
| `ADMIN_SECRET` | Un mot de passe fort (ex: `senbitik-prod-xyz789`) |
| `PORT` | `3001` *(Railway le gère automatiquement, optionnel)* |

> **Ne pas ajouter** `DB_HOST` etc. — Railway fournit `MYSQL_*` automatiquement.

---

## Étape 5 — Déployer

Railway lance automatiquement :
1. `npm install` → installe les dépendances frontend + backend
2. `npm run build` → compile le React en fichiers statiques
3. `NODE_ENV=production node backend/server.js` → démarre le serveur

Le serveur Express sert à la fois l'API et le site React.

---

## Étape 6 — Ajouter les produits

1. Ouvrez votre URL Railway (ex: `https://senbitik-production.up.railway.app`)
2. Connectez-vous avec `admin@senbitik.com` / `admin1234`
3. Allez dans **Produits** → ajoutez vos produits

---

## Commandes locales (rappel)

```bash
# Lancer en développement (frontend + backend simultanément)
npm start

# Construire pour la production
npm run build

# Démarrer en mode production (après build)
npm run start:prod
```

---

## Structure des fichiers en production

```
senbitik/
├── dist/                  ← Build React (généré par npm run build)
├── backend/
│   ├── server.js          ← Sert l'API + le dossier dist/
│   ├── public/uploads/    ← Images uploadées
│   └── .env               ← Variables locales (ne pas commiter !)
├── railway.toml           ← Config déploiement Railway
└── package.json
```

---

## ⚠️ Sécurité avant déploiement

- [ ] Changez `ADMIN_SECRET` dans Railway (ne laissez pas la valeur par défaut)
- [ ] Vérifiez que `backend/.env` est dans `.gitignore`
- [ ] Changez le mot de passe admin par défaut depuis le dashboard

---

## Autres plateformes

**Render.com** : similaire à Railway, même configuration
- Build command : `npm install && npm run build`
- Start command : `NODE_ENV=production node backend/server.js`
- Ajoutez un service MySQL (ou utilisez PlanetScale)

**VPS (Ubuntu)** :
```bash
git clone https://github.com/OmarFaye1/Senbitik.git
cd senbitik
npm install
npm run build
# Configurez backend/.env avec les vraies valeurs
NODE_ENV=production node backend/server.js
# Utilisez PM2 pour garder le serveur actif :
npm install -g pm2
pm2 start backend/server.js --name senbitik --env production
pm2 save && pm2 startup
```
