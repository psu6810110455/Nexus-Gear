import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

// ✅ 1. กำหนด Type ให้ Config และแปลง Port เป็นตัวเลข
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: Number(process.env.DB_PORT) || 5433, // TS ต้องการ number ชัดเจน
};

// ✅ 2. สร้าง Interface สำหรับหมวดหมู่ (Best Practice ของ TS)
interface CategoryItem {
    name: string;
    searchKey: string;
}

const GAMING_CATEGORIES: CategoryItem[] = [
    { name: 'มือถือเกมมิ่ง', searchKey: 'gaming phone' },
    { name: 'จอยควบคุม', searchKey: 'game controller' },
    { name: 'หูฟัง', searchKey: 'gaming headset' },
    { name: 'พัดลมระบายอากาศ', searchKey: 'phone cooler fan' },
    { name: 'ถุงนิ้วเกมมิ่ง', searchKey: 'gaming finger sleeves' },
    { name: 'อุปกรณ์เสริมอื่นๆ', searchKey: 'gaming accessories' }
];

const BRANDS: string[] = ['Nexus', 'ROG', 'Razer', 'Logitech G', 'SteelSeries', 'Black Shark', 'RedMagic'];

async function seedGamingData() {
    let connection;
    try {
        console.log(`🔌 กำลังเชื่อมต่อ Database ที่ ${dbConfig.host}:${dbConfig.port}...`);
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ เชื่อมต่อสำเร็จ! เริ่มต้นกระบวนการ Seed ข้อมูล...');

        // 1. ล้างข้อมูลเก่า
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        const tables = [
            'order_status_history', 'payments', 'reviews', 'order_items', 
            'orders', 'cart_items', 'addresses', 'products', 'categories', 'coupons', 'users'
        ];
        
        for (const table of tables) {
            try {
                // ใช้ DELETE แทน TRUNCATE เพื่อความปลอดภัยและชัวร์กว่าในบาง Environment
                await connection.execute(`DELETE FROM ${table}`);
                // รีเซ็ต ID ให้เริ่มที่ 1 ใหม่
                await connection.execute(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
            } catch (err) {
                // ข้าม error กรณีตารางยังไม่ถูกสร้าง
            }
        }
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🧹 ล้างข้อมูลเดิมเรียบร้อยแล้ว');

        // 2. สร้าง Admin
        const hashedPass = await bcrypt.hash('123456', 10);
        await connection.execute(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
            ['admin@nexus.com', hashedPass, 'Admin Nexus', 'admin']
        );
        console.log('👤 สร้าง User: Admin เรียบร้อย');

        // 3. สร้าง Categories
        const categoryIds: { id: number; name: string; key: string }[] = [];
        for (const cat of GAMING_CATEGORIES) {
            const [res]: any = await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat.name, `https://dummyimage.com/400x400/000/fff?text=${encodeURIComponent(cat.name)}`]
            );
            categoryIds.push({ id: res.insertId, name: cat.name, key: cat.searchKey });
        }
        console.log('📁 สร้างหมวดหมู่สินค้าครบ 6 ประเภทแล้ว');

        // 4. สร้าง Products
        console.log('📦 กำลังสร้างสินค้า 156 ชิ้น...');
        for (let i = 0; i < 156; i++) { 
            const cat = faker.helpers.arrayElement(categoryIds);
            const brand = faker.helpers.arrayElement(BRANDS);
            const productName = `${brand} ${faker.commerce.productName()} ${faker.helpers.arrayElement(['Pro', 'Ultra', 'RGB', 'Elite'])}`;

            await connection.execute(
                'INSERT INTO products (category_id, name, description, price, stock, image_url, rating_average) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    cat.id,
                    productName,
                    faker.commerce.productDescription(),
                    faker.commerce.price({ min: 150, max: 45000 }), 
                    faker.number.int({ min: 5, max: 200 }),
                    `https://dummyimage.com/500x500/111/dc2626?text=${encodeURIComponent(brand + ' ' + cat.name)}`,
                    faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })
                ]
            );
        }
        console.log('\n🎉 ดำเนินการ Seed ข้อมูลเสร็จสิ้น! (TypeScript Version)');

    } catch (error: any) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedGamingData();