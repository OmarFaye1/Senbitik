require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const mysql = require('mysql2/promise')

const e = process.env

// Supporte : variables locales (DB_*), Railway avec underscore (MYSQL_*), Railway sans underscore (MYSQLHOST…)
// Railway MySQL injecte parfois sans underscore : MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
const pool = mysql.createPool({
  host:     e.DB_HOST     || e.MYSQL_HOST     || e.MYSQLHOST     || 'localhost',
  port:     e.DB_PORT     || e.MYSQL_PORT     || e.MYSQLPORT     || 3306,
  user:     e.DB_USER     || e.MYSQL_USER     || e.MYSQLUSER     || 'root',
  password: e.DB_PASSWORD || e.MYSQL_PASSWORD || e.MYSQLPASSWORD || '',
  database: e.DB_NAME     || e.MYSQL_DATABASE || e.MYSQLDATABASE || 'senbitik_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
  ssl: (e.MYSQL_HOST || e.MYSQLHOST) ? { rejectUnauthorized: false } : undefined,
})

module.exports = pool
