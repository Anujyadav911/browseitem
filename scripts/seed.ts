import pool from '../src/db';
import { faker } from '@faker-js/faker';

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log(`Starting seeding of ${TOTAL_PRODUCTS} products...`);
    
    // Using a predefined set of categories
    const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Toys', 'Automotive', 'Books', 'Beauty'];

    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const values = [];
      const queryParams: any[] = [];
      
      for (let j = 0; j < BATCH_SIZE; j++) {
        const paramOffset = j * 5;
        const name = faker.commerce.productName();
        const category = categories[Math.floor(Math.random() * categories.length)];
        const price = faker.commerce.price({ min: 5, max: 2000, dec: 2 });
        // Spread the updated_at/created_at out to have distinct values
        const date = faker.date.recent({ days: 365 });
        
        queryParams.push(name, category, price, date, date);
        values.push(`($${paramOffset + 1}, $${paramOffset + 2}, $${paramOffset + 3}, $${paramOffset + 4}, $${paramOffset + 5})`);
      }

      const query = `
        INSERT INTO products (name, category, price, created_at, updated_at)
        VALUES ${values.join(',')}
      `;

      await client.query(query, queryParams);
      console.log(`Inserted ${i + BATCH_SIZE} / ${TOTAL_PRODUCTS} products`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
