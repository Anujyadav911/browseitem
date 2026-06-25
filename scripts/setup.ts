import pool from '../src/db';

async function setupDatabase() {
  const client = await pool.connect();
  try {
    console.log('Creating table products...');
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

    console.log('Creating index idx_products_updated_id...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_updated_id 
      ON products(updated_at DESC, id DESC);
    `);

    console.log('Creating index idx_products_category_updated_id...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category_updated_id 
      ON products(category, updated_at DESC, id DESC);
    `);

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
