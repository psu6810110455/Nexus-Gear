const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

// ตั้งค่า Database (เช็ค Port ให้ตรงกับ Docker ของคุณ: 5433)
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'rootpassword', 
    database: 'ecommerce_db',
    port: 5433 
};

// 1. หมวดหมู่สาย Gaming
const CATEGORIES = [
    'Gaming Phones', 
    'Mechanical Keyboards', 
    'Gaming Mice', 
    'Gaming Headsets', 
    'Gaming Monitors', 
    'Streaming Gear'
];

// 2. ชื่อแบรนด์สมมติ (เพื่อให้ดูสมจริง)
const PHONE_BRANDS = ['ROG Phone', 'Black Shark', 'RedMagic', 'Legion Phone', 'Razer Phone'];
const GEAR_BRANDS = ['Logitech G', 'Razer', 'SteelSeries', 'HyperX', 'Corsair', 'Keychron'];
const ADJECTIVES = ['Pro', 'Ultra', 'Elite', 'V2', 'RGB', 'Wireless', 'Tournament Edition'];

async function seedGamingData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('🔌 Connecting to Gaming Database...');

        // เคลียร์ข้อมูลเก่า
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE products');
        await connection.execute('TRUNCATE TABLE categories');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('🧹 Cleared old data.');

        // --- STEP 1: สร้าง Categories ---
        const categoryIds = [];
        for (const cat of CATEGORIES) {
            const [res] = await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=80']
            );
            categoryIds.push({ id: res.insertId, name: cat });
        }
        console.log('✅ Created Gaming Categories');

        // --- STEP 2: สร้าง Products (100 ชิ้น) ---
        const products = [];
        for (let i = 0; i < 100; i++) {
            // สุ่มหมวดหมู่
            const selectedCat = faker.helpers.arrayElement(categoryIds);
            
            let productName = '';
            let price = 0;

            // ตั้งชื่อสินค้าให้เข้ากับหมวดหมู่
            if (selectedCat.name === 'Gaming Phones') {
                const brand = faker.helpers.arrayElement(PHONE_BRANDS);
                const model = faker.number.int({ min: 5, max: 9 });
                const suffix = faker.helpers.arrayElement(ADJECTIVES);
                productName = `${brand} ${model} ${suffix}`;
                price = faker.commerce.price({ min: 15000, max: 45000 }); // ราคาแพงหน่อย
            } else {
                const brand = faker.helpers.arrayElement(GEAR_BRANDS);
                const type = selectedCat.name.replace('Gaming ', '').replace('s', ''); // ตัดคำให้เหลือแค่ Mouse, Keyboard
                const suffix = faker.helpers.arrayElement(ADJECTIVES);
                productName = `${brand} ${type} ${faker.word.noun().toUpperCase()} ${suffix}`;
                price = faker.commerce.price({ min: 1200, max: 8900 });
            }

            products.push([
                selectedCat.id,
                productName,
                faker.commerce.productDescription(),
                price,
                faker.number.int({ min: 0, max: 50 }),  // Stock
                // ใช้รูป Tech จาก Unsplash
                `https://source.unsplash.com/random/500x500/?gaming,${selectedCat.name.split(' ')[1]}`, 
                faker.number.float({ min: 3.5, max: 5, precision: 0.1 }) // Rating
            ]);
        }

        // ยัดลง Database
        await connection.query(
            'INSERT INTO products (category_id, name, description, price, stock, image_url, rating) VALUES ?',
            [products]
        );

        console.log('🎉 MISSION COMPLETE! สร้างสินค้า Gaming Gear 100 ชิ้นเรียบร้อย');

    } catch (error) {
        console.error('❌ GAME OVER:', error.message);
    } finally {
        if (connection) connection.end();
    }
}

seedGamingData();