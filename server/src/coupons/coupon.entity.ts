import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum CouponType {
  FIXED   = 'fixed',    // ลดเป็นจำนวนเงิน เช่น ลด 50 บาท
  PERCENT = 'percent',  // ลดเป็นเปอร์เซ็นต์ เช่น ลด 10%
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  // รหัสคูปอง เช่น SALE50, WELCOME200
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  // ประเภทการลด: fixed หรือ percent
  @Column({ type: 'enum', enum: CouponType, default: CouponType.FIXED })
  type: CouponType;

  // จำนวนที่ลด เช่น 50 (บาท) หรือ 10 (เปอร์เซ็นต์)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  // ยอดขั้นต่ำที่ต้องซื้อก่อนใช้คูปองได้ (0 = ไม่มีขั้นต่ำ)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  min_order_amount: number;

  // ใช้งานได้อยู่ไหม
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}