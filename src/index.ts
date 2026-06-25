import express from 'express';
import cors from 'cors';
import { ProductController } from './controllers/productController';
import { errorHandler } from './middlewares/errorHandler';
import { initDb } from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/products', ProductController.getProducts);

app.use(errorHandler);

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

start();
