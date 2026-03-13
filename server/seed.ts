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

const CATEGORIES = [
    { name: 'มือถือเกมมิ่ง', key: 'มือถือเกมมิ่ง' },
    { name: 'จอยควบคุม', key: 'จอยควบคุม' },
    { name: 'หูฟัง', key: 'หูฟัง' },
    { name: 'พัดลมระบายอากาศ', key: 'พัดลมระบายอากาศ' },
    { name: 'ถุงนิ้วเกมมิ่ง', key: 'ถุงนิ้วเกมมิ่ง' },
    { name: 'อุปกรณ์เสริมอื่นๆ', key: 'อุปกรณ์เสริมอื่นๆ' }
];

const REAL_PRODUCTS = [
    { name: 'ROG Phone 7 Ultimate', category: 'มือถือเกมมิ่ง', price: 42990, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&h=500&q=80', desc: 'สุดยอดสมาร์ทโฟนเกมมิ่งแห่งปี พร้อมระบบระบายความร้อน AeroActive Cooler 7' },
    { name: 'Black Shark 5 Pro', category: 'มือถือเกมมิ่ง', price: 28900, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=500&h=500&q=80', desc: 'สมาร์ทโฟนเกมมิ่งสายพันธุ์ดุ พร้อมปุ่ม Shoulder Trigger ของแท้' },
    { name: 'RedMagic 8 Pro Titanium', category: 'มือถือเกมมิ่ง', price: 31500, image: 'https://images.unsplash.com/photo-1622485603417-af92ba667d4f?auto=format&fit=crop&w=500&h=500&q=80', desc: 'มือถือเรือธงสำหรับเกมเมอร์ขั้นสุดด้วยดีไซน์ขอบเหลี่ยมล้ำอนาคต' },
    { name: 'HyperX Cloud Alpha Wireless', category: 'หูฟัง', price: 3290, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&h=500&q=80', desc: 'หูฟังเกมมิ่งระดับโปร ใช้งานไร้สายได้นานสูงสุดถึง 300 ชั่วโมง' },
    { name: 'SteelSeries Arctis Nova Pro', category: 'หูฟัง', price: 12500, image: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=500&h=500&q=80', desc: 'หูฟังไฮเอนด์ พลังเสียงระดับ High-Res Audio' },
    { name: 'Razer Kishi V2 for Android', category: 'จอยควบคุม', price: 3590, image: 'https://images.unsplash.com/photo-1600861194942-f56f1dc9ebc4?auto=format&fit=crop&w=500&h=500&q=80', desc: 'จอยเกมติดมือถือ สัมผัสประหนึ่งคอนโซลแท้ๆ' },
    { name: 'ROG Kunai 3 Gamepad', category: 'จอยควบคุม', price: 4290, image: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?auto=format&fit=crop&w=500&h=500&q=80', desc: 'Gamepad ROG ดีไซน์ Modular ถอดเปลี่ยนได้ดั่งใจ' },
    { name: 'Flydigi Apex 3 Elite', category: 'จอยควบคุม', price: 2990, image: 'https://images.unsplash.com/photo-1612287232202-029ceea98093?auto=format&fit=crop&w=500&h=500&q=80', desc: 'จอยเกมมิ่งที่นักแข่ง eSport เลือกใช้ พร้อมจอ LED บันทึกโปรไฟล์ได้' },
    { name: 'Black Shark Finger Sleeves', category: 'ถุงนิ้วเกมมิ่ง', price: 190, image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=500&h=500&q=80', desc: 'ถุงนิ้ว Carbon Fiber ลดแรงเสียดทาน สไลด์ลื่นไม่มีสะดุด' },
    { name: 'Razer Gaming Finger Sleeve', category: 'ถุงนิ้วเกมมิ่ง', price: 390, image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=500&h=500&q=80', desc: 'ถุงนิ้วระดับโปรจาก Razer ทำจากเงินและไนลอน ระบายอากาศได้เยี่ยม' },
    { name: 'Black Shark Magnetic Cooler', category: 'พัดลมระบายอากาศ', price: 1590, image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&h=500&q=80', desc: 'พัดลมทำความเย็นพลังแม่เหล็กติดหลังโทรศัพท์ ใช้งานสะดวก' },
    { name: 'Razer Phone Cooler Chroma', category: 'พัดลมระบายอากาศ', price: 2190, image: 'https://images.unsplash.com/photo-1605330364239-2b0f49fe8e69?auto=format&fit=crop&w=500&h=500&q=80', desc: 'พัดลมแม่เหล็กพร้อมไฟ RGB สวยจัดเต็มสไตล์ Razer' },
    { name: 'Logitech G Pro X Superlight', category: 'อุปกรณ์เสริมอื่นๆ', price: 5490, image: 'https://images.unsplash.com/photo-1527814050087-3c00e7ee6c9a?auto=format&fit=crop&w=500&h=500&q=80', desc: 'เมาส์เกมมิ่งไร้สายยอดฮิตของโปรเพลเยอร์ น้ำหนักเบาเพียง 63 กรัม' },
    { name: 'Razer BlackWidow V3 Pro', category: 'อุปกรณ์เสริมอื่นๆ', price: 4290, image: 'https://images.unsplash.com/photo-1511467687858-23d19286d8b4?auto=format&fit=crop&w=500&h=500&q=80', desc: 'คีย์บอร์ดเกมมิ่งไร้สาย ทัชสกรีนและสวิตช์ Green ตอบสนองไว' }
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

        // 3. สร้าง Categories ให้สมบูรณ์
        const catMap: Record<string, number> = {};
        for (const cat of CATEGORIES) {
            // ใช้ dummy image ที่มีความเกี่ยวข้องเล็กน้อยสำหรับหมวดหมู่
            const catImage = `https://dummyimage.com/400x400/000/fff?text=${encodeURIComponent(cat.name)}`;
            const [res]: any = await connection.execute(
                'INSERT INTO categories (name, image_url) VALUES (?, ?)',
                [cat.name, catImage]
            );
            catMap[cat.name] = res.insertId;
        }
        console.log(`📁 สร้างหมวดหมู่สินค้า ${CATEGORIES.length} ประเภทแล้ว`);

        // 4. สร้าง Products
        console.log(`📦 กำลังสร้างสินค้าประมาณ ${REAL_PRODUCTS.length * 5} ชิ้น (Variants)...`);
        let inserted = 0;
        
        // Loop สร้าง Variants ของสินค้าจริง เพื่อให้ร้านค้าดูมีสินค้าหลากหลาย โดยรูปภาพยังคงสมจริง
        for(let loop = 0; loop < 5; loop++) {
            for (const p of REAL_PRODUCTS) { 
                const catId = catMap[p.category];
                if (!catId) continue;

                const isVariant = loop > 0;
                // สร้างชื่อที่ต่างกันในแต่ละรอบ
                let variantRef = '';
                if (loop === 1) variantRef = ' (Edition 2024)';
                if (loop === 2) variantRef = ' [Lite Version]';
                if (loop === 3) variantRef = ' (Refurbished)';
                if (loop === 4) variantRef = ' - Special Bundle';

                const productName = p.name + variantRef;
                // ปรับเปลี่ยนราคาตามรอบ
                const priceMultiplier = loop === 2 ? 0.7 : loop === 4 ? 1.3 : 1.0;
                const price = Math.floor(p.price * priceMultiplier);

                await connection.execute(
                    'INSERT INTO products (category_id, name, description, price, stock, image_url, rating_average) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        catId,
                        productName,
                        p.desc + (isVariant ? ' พร้อมรับประกันพิเศษจากร้านค้า' : ' สินค้าคุณภาพสูงของแท้ 100%'),
                        price, 
                        faker.number.int({ min: 0, max: 150 }), // สต็อกแบบสมจริง
                        p.image, // ใช้ภาพจริงจาก Amazon/แบรนด์
                        faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 })
                    ]
                );
                inserted++;
            }
        }
        console.log(`\n🎉 ดำเนินการ Seed ข้อมูล ${inserted} ชิ้นเสร็จสิ้น! (Diverse Real Photo Version)`);

    } catch (error: any) {
        console.error('❌ เกิดข้อผิดพลาด:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

seedGamingData();