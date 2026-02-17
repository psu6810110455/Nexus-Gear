const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ตั้งค่า Database ตาม Docker (5433:3306)
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1', // แนะนำให้ใช้ IP หากเป็น Docker
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword', // ใส่รหัสผ่านของคุณตรงนี้
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT || 5433 // พอร์ตที่ Map ออกมานอก Container
};

// กำหนดหมวดหมู่
const GAMING_CATEGORIES = [
    { name: 'มือถือเกมมิ่ง', searchKey: 'gaming phone' },
    { name: 'จอยควบคุม', searchKey: 'game controller' },
    { name: 'หูฟัง', searchKey: 'gaming headset' },
    { name: 'พัดลมระบายอากาศ', searchKey: 'phone cooler fan' },
    { name: 'ถุงนิ้วเกมมิ่ง', searchKey: 'gaming finger sleeves' },
    { name: 'อุปกรณ์เสริมอื่นๆ', searchKey: 'gaming accessories' }
];

const BRANDS = ['Nexus', 'ROG', 'Razer', 'Logitech G', 'SteelSeries', 'Black Shark', 'RedMagic'];

async function seedGamingData() {
    let connection;
    try {
        console.log('🔌 กำลังเชื่อมต่อฐานข้อมูลที่ ' + dbConfig.host + ':' + dbConfig.port + '...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ!');

        // 1. ล้างข้อมูลเก่า (Truncate)
        console.log('🧹 กำลังล้างข้อมูลเดิม...');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['order_status_history', 'payments', 'reviews', 'order_items', 'orders', 'cart_items', 'addresses', 'products', 'categories', 'coupons', 'users'];
        for (const table of tables) {
            await connection.execute(`TRUNCATE TABLE ${table}`);
        }
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🧹 ล้างข้อมูลเดิมเรียบร้อยแล้ว');

        // 2. สร้าง Admin
        const hashedPass = await bcrypt.hash('123456', 10);
        await connection.execute('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', ['admin@nexus.com', hashedPass, 'Admin Nexus', 'admin']);
        console.log('👤 สร้าง User: Admin เรียบร้อย');

        // 3. สร้าง Categories
        const categoryIds = [];
        for (const cat of GAMING_CATEGORIES) {
            const [res] = await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat.name, `https://source.unsplash.com/random/400x400/?${cat.searchKey}`]
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
                    `https://source.unsplash.com/random/500x500/?gaming,tech,${cat.key}&sig=${i}`,
                    faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 })
                ]
            );
        }
        console.log('📦 สร้างสินค้าเรียบร้อย');

        console.log('\n🎉 ดำเนินการ Seed ข้อมูลเสร็จสิ้น! ข้อมูลพร้อมใช้งานแล้วครับ');

    } catch (error) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedGamingData();