import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import pg from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Database Configuration
let pool = null;
if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// --- MOCK DATA FOR SEEDING ---
const SEED_PRODUCTS = [
  {
    id: 'c1', type: 'course', title: 'Full Stack Web Development', 
    description: 'Master the MERN stack and build real-world applications.',
    price: 3499, originalPrice: 12999, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    rating: 4.8, reviewsCount: 1240, author: 'CodeWithRahul', tags: ['Web Dev', 'React', 'NodeJS']
  },
  {
    id: 'c2', type: 'course', title: 'Digital Marketing Mastery',
    description: 'Learn SEO, Social Media, and Google Ads.',
    price: 1999, originalPrice: 4999, thumbnail: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=80',
    rating: 4.6, reviewsCount: 850, author: 'Priya Digital', tags: ['Marketing', 'SEO']
  },
  {
    id: 'd1', type: 'download', title: 'GST Invoice Template',
    description: 'Professional, GST-compliant invoice templates.',
    price: 499, originalPrice: 999, thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    rating: 4.7, reviewsCount: 320, author: 'BizTools', tags: ['Business', 'Templates']
  },
  {
    id: 'a1', type: 'academic', title: 'Class 12 Physics Notes',
    description: 'Last 10 years solved papers and important questions.',
    price: 199, originalPrice: 499, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    rating: 4.8, reviewsCount: 450, author: 'TopperNotes', tags: ['CBSE', 'Physics']
  }
];

// --- DATABASE INITIALIZATION ---
const initDb = async () => {
  if (!pool) {
    console.warn("⚠️  DATABASE_URL not found. Running in Memory Mode (Changes won't persist).");
    return;
  }

  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL Database");

    // Create Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        ext_id VARCHAR(50) UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price INTEGER,
        original_price INTEGER,
        thumbnail TEXT,
        rating DECIMAL,
        reviews_count INTEGER,
        author VARCHAR(100),
        type VARCHAR(50),
        tags TEXT[]
      );
    `);

    // Seed Data if Empty
    const res = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(res.rows[0].count) === 0) {
      console.log("🌱 Seeding database with initial products...");
      for (const p of SEED_PRODUCTS) {
        await client.query(`
          INSERT INTO products (ext_id, title, description, price, original_price, thumbnail, rating, reviews_count, author, type, tags)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [p.id, p.title, p.description, p.price, p.originalPrice, p.thumbnail, p.rating, p.reviewsCount, p.author, p.type, p.tags]);
      }
    }
    client.release();
  } catch (err) {
    console.error("❌ Database Initialization Error:", err.message);
    // Do not crash, just continue, routes will handle fallback
  }
};

initDb();

// --- API ROUTES ---

// Get All Products
app.get('/api/products', async (req, res) => {
  // Try fetching from DB
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM products');
      if (result && result.rows) {
        // Transform DB rows back to frontend shape
        const products = result.rows.map(row => ({
          id: row.ext_id,
          title: row.title,
          description: row.description,
          price: row.price,
          originalPrice: row.original_price,
          thumbnail: row.thumbnail,
          rating: parseFloat(row.rating),
          reviewsCount: row.reviews_count,
          author: row.author,
          type: row.type,
          tags: row.tags
        }));
        return res.json(products);
      }
    } catch (err) {
      console.error("Database query failed, falling back to mock data:", err.message);
      // Fallback to mock data below
    }
  }
  
  // Default/Fallback Response
  res.json(SEED_PRODUCTS);
});

// Login (Simulated)
app.post('/api/auth/login', (req, res) => {
  const { role } = req.body;
  const user = {
    id: 'u1',
    name: 'Aditi Sharma',
    email: 'aditi@example.com',
    role: role || 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    walletBalance: 0
  };
  res.json(user);
});

// Create Order (Simulated)
app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;
  res.json({ success: true, orderId: `ord_${Math.random().toString(36).substr(2, 9)}` });
});

// Serve React App for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});