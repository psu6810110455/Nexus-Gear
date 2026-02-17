const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. ตั้งค่า CORS (แบบเปิดกว้างที่สุดเพื่อแก้ปัญหา)
// ==========================================
app.use(cors({
    origin: '*', // ยอมรับทุกเว็บ (แก้ปัญหา Blocked by CORS policy)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Log ทุก Request ที่เข้ามา (เพื่อเช็คว่า Frontend ยิงมาถึงไหม)
app.use((req, res, next) => {
    console.log(`🔔 มี Request เข้ามา: ${req.method} ${req.url}`);
    next();
});

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: parseInt(process.env.DB_PORT) || 5433
};

// สร้าง Connection Pool
const pool = mysql.createPool(dbConfig);

// API ดึงสินค้า
app.get('/products', async (req, res) => {
    try {
        // Query โดยใช้ชื่อ Field ใน DB จริงๆ (snake_case)
        const [rows] = await pool.execute(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);

        // แปลงเป็น camelCase เพื่อส่งให้ Frontend
        const products = rows.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: parseFloat(p.price),
            stock: p.stock,
            image_url: p.image_url, // ส่งไปทั้ง snake_case (เผื่อ Frontend ใช้ตัวนี้)
            imageUrl: p.image_url,  // ส่งไปทั้ง camelCase (เผื่อ Frontend ใช้ตัวนี้)
            category: { name: p.category_name || 'General' }
        }));

        console.log(`✅ ส่งข้อมูลสินค้ากลับไป ${products.length} รายการ`);
        res.json(products);
    } catch (error) {
        console.error('❌ Database Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server พร้อมทำงานที่ http://localhost:${PORT}`);
    console.log(`waiting for request...`);
});