require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const mysql = require('mysql2/promise')

// Supporte les variables Railway MySQL (MYSQL_*) en plus des variables locales (DB_*)
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || process.env.MYSQL_HOST     || 'localhost',
  port:     process.env.DB_PORT     || process.env.MYSQL_PORT     || 3306,
  user:     process.env.DB_USER     || process.env.MYSQL_USER     || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME     || process.env.MYSQL_DATABASE || 'natamansa_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ssl: process.env.MYSQL_HOST ? { rejectUnauthorized: false } : undefined,
})

module.exports = pool
