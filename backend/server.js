require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const express     = require('express')
const cors        = require('cors')
const path        = require('path')
const compression = require('compression')
const initDB   = require('./initDB')

const ordersRouter   = require('./routes/orders')
const adminRouter    = require('./routes/admin')
const productsRouter = require('./routes/products')
const uploadRouter   = require('./routes/upload')

const app    = express()
const PORT   = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

// CORS — en dev: localhost:3000 | en prod: même domaine (origin: true reflète l'origine)
app.use(compression())
app.use(cors({
  origin: process.env.CLIENT_URL || (isProd ? true : 'http://localhost:3000'),
  credentials: true,
}))
app.use(express.json())

// Images uploadées
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// Routes API
app.use('/api/products',      productsRouter)
app.use('/api/orders',        ordersRouter)
app.use('/api/admin',         adminRouter)
app.use('/api/admin/upload',  uploadRouter)

app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'senbitik-api' }))

// En production : sert le build React (dossier dist/ à la racine du projet)
if (isProd) {
  const distPath = path.join(__dirname, '../dist')
  app.use(express.static(distPath))
  // SPA fallback — toutes les routes non-API → index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(distPath, 'index.html'))
    }
  })
}

// Démarrage : init DB puis écoute
async function start() {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`✅ Senbitik API démarrée sur http://localhost:${PORT}`)
      if (isProd) console.log(`🌐 Frontend servi depuis /dist`)
    })
  } catch (err) {
    console.error('❌ Impossible de démarrer :', err.message || err.code || err)
    console.error('Variables DB détectées:', {
      host: process.env.DB_HOST || process.env.MYSQL_HOST || process.env.MYSQLHOST || '(aucune)',
      user: process.env.DB_USER || process.env.MYSQL_USER || process.env.MYSQLUSER || '(aucun)',
      database: process.env.DB_NAME || process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || '(aucune)',
    })
    process.exit(1)
  }
}

start()
