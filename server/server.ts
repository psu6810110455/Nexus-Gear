import express, { Request, Response, NextFunction } from 'express';
import mysql, { PoolOptions, RowDataPacket } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

// โหลด Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Type สำหรับ Config Database
const dbConfig: PoolOptions = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: Number(process.env.DB_PORT) || 5433, // แปลงเป็น number เสมอ
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// สร้าง Connection Pool
const pool = mysql.createPool(dbConfig);

// Interface สำหรับข้อมูลดิบที่ได้จาก Database (RowDataPacket คือ type มาตรฐานของ mysql2)
interface ProductRow extends RowDataPacket {
    id: number;
    name: string;
    description: string;
    price: string | number; // MySQL บางทีส่ง Decimal มาเป็น String
    stock: number;
    image_url: string;
    category_id: number;
    category_name: string | null;
}

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// Log Middleware พร้อม Type
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`🔔 มี Request เข้ามา: ${req.method} ${req.url}`);
    next();
});

// API ดึงสินค้า
app.get('/products', async (req: Request, res: Response): Promise<void> => {
    try {
        // ใช้ Generic <ProductRow[]> เพื่อบอกว่าผลลัพธ์จะเป็น Array ของ ProductRow
        const [rows] = await pool.execute<ProductRow[]>(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);

        // Map ข้อมูลพร้อม Type Checking
        const products = rows.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price, // กันเหนียวแปลงเป็น Float
            stock: p.stock,
            image_url: p.image_url, 
            imageUrl: p.image_url,  
            category: { name: p.category_name || 'General' }
        }));

        console.log(`✅ ส่งข้อมูลสินค้ากลับไป ${products.length} รายการ`);
        
        // ส่ง response กลับ
        res.json(products);
        
    } catch (error) {
        // จัดการ Error type
        const errorMessage = (error as Error).message;
        console.error('❌ Database Error:', errorMessage);
        res.status(500).json({ error: errorMessage });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server พร้อมทำงานที่ http://localhost:${PORT}`);
    console.log(`waiting for request...`);
});