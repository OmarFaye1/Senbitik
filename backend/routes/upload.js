const express = require('express')
const multer  = require('multer')
const path    = require('path')
const fs      = require('fs')

const router = express.Router()

// Dossier de stockage
const UPLOAD_DIR = path.join(__dirname, '../public/uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowed.includes(ext)) cb(null, true)
    else cb(new Error('Format non supporté. Utilisez JPG, PNG ou WEBP.'))
  },
})

// POST /api/admin/upload  — upload 1 image
router.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'Aucun fichier reçu' })
    const url = `/uploads/${req.file.filename}`
    res.json({ url, filename: req.file.filename })
  })
})

// DELETE /api/admin/upload/:filename — supprimer une image
router.delete('/:filename', (req, res) => {
  const file = path.join(UPLOAD_DIR, path.basename(req.params.filename))
  if (fs.existsSync(file)) fs.unlinkSync(file)
  res.json({ success: true })
})

module.exports = router
