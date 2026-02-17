const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: process.env.DB_PORT || 5433
};

async function seed() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to database...');

    try {
        // 1. Clear Data
        await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
        await connection.execute('TRUNCATE TABLE products');
        await connection.execute('TRUNCATE TABLE categories');
        await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Cleared old data.');

        // 2. Insert Categories
        const categories = [
            { name: 'Gaming Mouse', img: 'mouse.jpg' },
            { name: 'Mechanical Keyboard', img: 'keyboard.jpg' },
            { name: 'Gaming Headset', img: 'headset.jpg' },
            { name: 'Gaming Chair', img: 'chair.jpg' },
            { name: 'Monitor', img: 'monitor.jpg' }
        ];

        for (const cat of categories) {
            await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat.name, cat.img]
            );
        }
        console.log('Inserted Categories.');

        // 3. Insert Products (Gaming Gear)
        const [catRows] = await connection.execute('SELECT id FROM categories');
        const catIds = catRows.map(c => c.id);

        const products = [];
        for (let i = 0; i < 50; i++) {
            products.push([
                faker.commerce.productName() + ' Gaming Edition',
                faker.commerce.productDescription(),
                faker.commerce.price({ min: 1000, max: 5000 }),
                faker.number.int({ min: 10, max: 100 }), // stock
                'https://placehold.co/600x400', // image_url
                faker.number.float({ min: 3, max: 5, precision: 0.1 }), // rating
                catIds[Math.floor(Math.random() * catIds.length)] // category_id
            ]);
        }

        for (const p of products) {
            await connection.execute(
                'INSERT INTO products (name, description, price, stock, image_url, rating_average, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                p
            );
        }
        console.log(`Inserted ${products.length} Products.`);

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await connection.end();
    }
}

seed();