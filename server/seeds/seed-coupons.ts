import { DataSource } from 'typeorm';
import { Coupon, CouponType } from '../src/coupons/coupon.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type:     'mysql',
  host:     '127.0.0.1',
  port:     5433,
  username: 'root',
  password: 'rootpassword',
  database: 'ecommerce_db',
  entities: [Coupon],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(Coupon);

  const coupons = [
    { code: 'SALE50',    type: CouponType.FIXED,   value: 50,  min_order_amount: 0,    is_active: true },
    { code: 'WELCOME200',type: CouponType.FIXED,   value: 200, min_order_amount: 500,  is_active: true },
    { code: 'NEXUS10',   type: CouponType.PERCENT, value: 10,  min_order_amount: 1000, is_active: true },
    { code: 'FREESHIP',  type: CouponType.FIXED,   value: 150, min_order_amount: 0,    is_active: true },
  ];

  for (const c of coupons) {
    const exists = await repo.findOne({ where: { code: c.code } });
    if (!exists) {
      await repo.save(repo.create(c));
      console.log(`✅ เพิ่มคูปอง: ${c.code}`);
    } else {
      console.log(`⏭️  มีอยู่แล้ว: ${c.code}`);
    }
  }

  await AppDataSource.destroy();
  console.log('🎉 Seed คูปองเสร็จแล้ว!');
}

seed().catch(console.error);