import mysql from 'mysql2/promise';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'ecommerce_db',
    port: Number(process.env.DB_PORT) || 5433,
};

// ===== รูปภาพ Static ที่ Host ไว้ใน client/public/products/ =====
// ใช้ http://localhost:5173 เป็น base URL เพื่อให้ Frontend โหลดรูปภาพจาก local ได้เลย
const IMG_BASE = '/products';

const CATEGORY_IMAGES: Record<string, string> = {
    'มือถือเกมมิ่ง':       `${IMG_BASE}/gaming-phone.png`,
    'จอยควบคุม':          `${IMG_BASE}/gaming-controller.png`,
    'หูฟัง':              `${IMG_BASE}/gaming-headset.png`,
    'พัดลมระบายอากาศ':     `${IMG_BASE}/phone-cooler.png`,
    'ถุงนิ้วเกมมิ่ง':      `${IMG_BASE}/finger-sleeves.png`,
    'อุปกรณ์เสริมอื่นๆ':    `${IMG_BASE}/gaming-accessories.png`,
};

const CATEGORIES = [
    { name: 'มือถือเกมมิ่ง', key: 'มือถือเกมมิ่ง' },
    { name: 'จอยควบคุม', key: 'จอยควบคุม' },
    { name: 'หูฟัง', key: 'หูฟัง' },
    { name: 'พัดลมระบายอากาศ', key: 'พัดลมระบายอากาศ' },
    { name: 'ถุงนิ้วเกมมิ่ง', key: 'ถุงนิ้วเกมมิ่ง' },
    { name: 'อุปกรณ์เสริมอื่นๆ', key: 'อุปกรณ์เสริมอื่นๆ' }
];

// ===== สินค้าพร้อมรูปภาพที่ตรงกับชื่อ =====
const REAL_PRODUCTS = [
    // --- มือถือเกมมิ่ง ---
    { name: 'ROG Phone 7 Ultimate',       category: 'มือถือเกมมิ่ง', price: 42990, desc: 'สุดยอดสมาร์ทโฟนเกมมิ่ง ชิป Snapdragon 8 Gen 2 พร้อมระบบระบายความร้อน AeroActive Cooler 7' },
    { name: 'Black Shark 5 Pro',          category: 'มือถือเกมมิ่ง', price: 28900, desc: 'สมาร์ทโฟนเกมมิ่งสายพันธุ์ดุ พร้อมปุ่ม Shoulder Trigger ในตัว' },
    { name: 'RedMagic 8 Pro',             category: 'มือถือเกมมิ่ง', price: 31500, desc: 'มือถือเรือธงสำหรับเกมเมอร์ พร้อมพัดลมระบายความร้อนในตัว' },
    { name: 'Nubia RedMagic 9S Pro',      category: 'มือถือเกมมิ่ง', price: 35900, desc: 'เกมมิ่งโฟนรุ่นล่าสุดจาก Nubia ชิป Snapdragon 8 Gen 3 หน้าจอ AMOLED 120Hz' },

    // --- จอยควบคุม ---
    { name: 'Razer Kishi V2',             category: 'จอยควบคุม',     price: 3590,  desc: 'จอยเกมติดมือถือสัมผัสประหนึ่งคอนโซลแท้ๆ รองรับ USB-C' },
    { name: 'ROG Kunai 3 Gamepad',        category: 'จอยควบคุม',     price: 4290,  desc: 'Gamepad ดีไซน์ Modular ถอดประกอบได้ เล่นเป็นจอยเดี่ยวหรือคู่ก็ได้' },
    { name: 'Flydigi Apex 3 Elite',       category: 'จอยควบคุม',     price: 2990,  desc: 'จอยที่นักแข่ง eSport เลือกใช้ พร้อมจอ LED บันทึกโปรไฟล์ได้' },
    { name: 'GameSir X2 Pro',             category: 'จอยควบคุม',     price: 2490,  desc: 'จอยเกมแบบ Clip-On สำหรับ Android รองรับ Xbox Cloud Gaming' },

    // --- หูฟัง ---
    { name: 'HyperX Cloud Alpha',         category: 'หูฟัง',         price: 3290,  desc: 'หูฟังเกมมิ่งระดับโปร ไดรเวอร์ Dual Chamber เสียงแยกชั้นชัดเจน' },
    { name: 'SteelSeries Arctis Nova Pro', category: 'หูฟัง',         price: 12500, desc: 'หูฟังไฮเอนด์ พลังเสียงระดับ Hi-Res Audio พร้อม ANC' },
    { name: 'Razer BlackShark V2 Pro',    category: 'หูฟัง',         price: 6990,  desc: 'หูฟังไร้สาย eSport ตัดเสียงรบกวนขั้นเทพ ไมค์คมชัด' },
    { name: 'Logitech G Pro X 2',         category: 'หูฟัง',         price: 8990,  desc: 'หูฟังเกมมิ่งไร้สายระดับมืออาชีพ ใช้ในการแข่ง Pro League' },

    // --- พัดลมระบายอากาศ ---
    { name: 'Black Shark Magnetic Cooler', category: 'พัดลมระบายอากาศ', price: 1590, desc: 'พัดลมทำความเย็นพลังแม่เหล็กติดหลังโทรศัพท์ทุกรุ่น' },
    { name: 'Razer Phone Cooler Chroma',   category: 'พัดลมระบายอากาศ', price: 2190, desc: 'พัดลมแม่เหล็กพร้อมไฟ RGB สวยจัดเต็มสไตล์ Razer' },
    { name: 'Flydigi B5X Cooler',          category: 'พัดลมระบายอากาศ', price: 990,  desc: 'พัดลมคลิปหนีบมือถือ ลดอุณหภูมิได้ 20 องศา ในราคาสุดคุ้ม' },

    // --- ถุงนิ้วเกมมิ่ง ---
    { name: 'Black Shark Finger Sleeves',  category: 'ถุงนิ้วเกมมิ่ง', price: 190,  desc: 'ถุงนิ้ว Carbon Fiber ลดแรงเสียดทาน สไลด์ลื่นไม่มีสะดุด' },
    { name: 'Razer Gaming Finger Sleeve',  category: 'ถุงนิ้วเกมมิ่ง', price: 390,  desc: 'ถุงนิ้วระดับโปรจาก Razer ทำจากเงินและไนลอน ระบายอากาศได้เยี่ยม' },
    { name: 'Memo Finger Sleeve Pro',      category: 'ถุงนิ้วเกมมิ่ง', price: 149,  desc: 'ถุงนิ้วราคาประหยัด ผ้าคาร์บอนไฟเบอร์ ไม่ลื่นไม่หลุด' },

    // --- อุปกรณ์เสริมอื่นๆ ---
    { name: 'Logitech G Pro X Superlight', category: 'อุปกรณ์เสริมอื่นๆ', price: 5490, desc: 'เมาส์เกมมิ่งไร้สาย น้ำหนักเบาเพียง 63 กรัม ยอดฮิตของโปรเพลเยอร์' },
    { name: 'Razer BlackWidow V3 Pro',     category: 'อุปกรณ์เสริมอื่นๆ', price: 4290, desc: 'คีย์บอร์ดเกมมิ่งไร้สายมาพร้อมสวิตช์ Green ตอบสนองเร็ว' },
    { name: 'SteelSeries QcK Heavy XL',    category: 'อุปกรณ์เสริมอื่นๆ', price: 1290, desc: 'แผ่นรองเมาส์เกมมิ่งขนาดใหญ่ พื้นผิว Micro-woven สำหรับความแม่นยำสูงสุด' },
];

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
                await connection.execute(`DELETE FROM ${table}`);
                await connection.execute(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
            } catch (err) {}
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
        const catMap: Record<string, number> = {};
        for (const cat of CATEGORIES) {
            const catImage = CATEGORY_IMAGES[cat.name] || `${IMG_BASE}/gaming-accessories.png`;
            const [res]: any = await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat.name, catImage]
            );
            catMap[cat.name] = res.insertId;
        }
        console.log(`📁 สร้างหมวดหมู่สินค้า ${CATEGORIES.length} ประเภทแล้ว`);

        // 4. สร้าง Products — ใช้รูปภาพที่ตรงกับหมวดหมู่ของสินค้า
        let inserted = 0;
        for (const p of REAL_PRODUCTS) {
            const catId = catMap[p.category];
            if (!catId) continue;

            // ดึงรูปภาพที่ตรงกับหมวดหมู่ของสินค้าตัวนี้
            const imageUrl = CATEGORY_IMAGES[p.category] || `${IMG_BASE}/gaming-accessories.png`;

            await connection.execute(
                'INSERT INTO products (category_id, name, description, price, stock, image_url, rating_average) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    catId,
                    p.name,
                    p.desc,
                    p.price,
                    faker.number.int({ min: 5, max: 150 }),
                    imageUrl,
                    faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })
                ]
            );
            inserted++;
        }

        console.log(`\n🎉 ดำเนินการ Seed ข้อมูล ${inserted} ชิ้นเสร็จสิ้น! (AI-Generated Photo Version)`);
        console.log('📸 รูปภาพ Static อยู่ที่ client/public/products/');

    } catch (error: any) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedGamingData();