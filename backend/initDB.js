/**
 * initDB.js — Crée automatiquement les tables si elles n'existent pas.
 * Appelé au démarrage du serveur. Idempotent (safe de relancer).
 */
const db = require('./db')

async function initDB() {
  const conn = await db.getConnection()
  try {
    // Création du schéma complet si tables absentes
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        product_id      VARCHAR(100)   UNIQUE NOT NULL,
        slug            VARCHAR(200)   UNIQUE NOT NULL,
        name_fr         VARCHAR(300)   NOT NULL,
        name_en         VARCHAR(300)   DEFAULT '',
        category        VARCHAR(100)   NOT NULL,
        producer        VARCHAR(100)   NOT NULL,
        price           DECIMAL(12,0)  NOT NULL,
        original_price  DECIMAL(12,0)  DEFAULT NULL,
        wholesale_price DECIMAL(12,0)  DEFAULT NULL,
        description_fr  TEXT,
        description_en  TEXT,
        features_fr     TEXT,
        features_en     TEXT,
        images          TEXT,
        dimensions      VARCHAR(200)   DEFAULT '',
        weight          VARCHAR(100)   DEFAULT '',
        stock           INT            DEFAULT 0,
        rating          DECIMAL(3,1)   DEFAULT 0.0,
        review_count    INT            DEFAULT 0,
        tags            TEXT,
        badge_fr        VARCHAR(100)   DEFAULT NULL,
        badge_en        VARCHAR(100)   DEFAULT NULL,
        featured        TINYINT(1)     DEFAULT 0,
        is_new          TINYINT(1)     DEFAULT 0,
        active          TINYINT(1)     DEFAULT 1,
        region_fr       VARCHAR(200)   DEFAULT '',
        region_en       VARCHAR(200)   DEFAULT '',
        created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id                   INT AUTO_INCREMENT PRIMARY KEY,
        order_id             VARCHAR(20)   UNIQUE NOT NULL,
        customer_first_name  VARCHAR(100)  NOT NULL,
        customer_last_name   VARCHAR(100)  NOT NULL,
        customer_phone       VARCHAR(30)   NOT NULL,
        city                 VARCHAR(100)  NOT NULL,
        quartier             VARCHAR(200)  DEFAULT '',
        payment_method       VARCHAR(50)   NOT NULL,
        subtotal             DECIMAL(12,0) NOT NULL,
        shipping             DECIMAL(12,0) NOT NULL DEFAULT 0,
        total                DECIMAL(12,0) NOT NULL,
        status               ENUM('en_attente','confirmee','en_livraison','livree','annulee')
                             DEFAULT 'en_attente',
        created_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at           TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        order_id       VARCHAR(20)   NOT NULL,
        product_id     VARCHAR(100)  NOT NULL,
        product_name   VARCHAR(250)  NOT NULL,
        product_image  VARCHAR(600)  DEFAULT '',
        price          DECIMAL(12,0) NOT NULL,
        quantity       INT           NOT NULL DEFAULT 1,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Migration : ajouter wholesale_price si table existante sans la colonne
    try {
      await conn.execute(`ALTER TABLE products ADD COLUMN wholesale_price DECIMAL(12,0) DEFAULT NULL AFTER original_price`)
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err
    }

    console.log('✅ Base de données — tables vérifiées')
  } catch (err) {
    console.error('❌ Erreur initialisation DB:', err.message)
    throw err
  } finally {
    conn.release()
  }
}

module.exports = initDB
