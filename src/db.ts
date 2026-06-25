import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();

// Use WebSockets so connections go over port 443 (HTTPS) instead of 5432
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Ensuring products table exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_updated_id 
      ON products(updated_at DESC, id DESC);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_updated_id 
      ON products(category, updated_at DESC, id DESC);
    `);
    const countResult = await client.query('SELECT COUNT(*) FROM products');
    console.log(`Database ready. Products in table: ${countResult.rows[0].count}`);
  } finally {
    client.release();
  }
}

export default pool;
