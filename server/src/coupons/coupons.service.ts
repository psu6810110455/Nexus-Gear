import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType } from './coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  // ── ตรวจสอบคูปอง ────────────────────────────────────────────────────────
  async validateCoupon(code: string, orderAmount: number = 0) {
    // หาคูปองจาก DB
    const coupon = await this.couponsRepository.findOne({
      where: { code: code.trim().toUpperCase(), is_active: true },
    });

    // ไม่พบคูปองหรือ inactive
    if (!coupon) {
      throw new BadRequestException('รหัสคูปองไม่ถูกต้องหรือหมดอายุ');
    }

    // เช็คยอดขั้นต่ำ
    if (orderAmount > 0 && orderAmount < Number(coupon.min_order_amount)) {
      throw new BadRequestException(
        `ต้องซื้อขั้นต่ำ ฿${coupon.min_order_amount} ถึงจะใช้คูปองนี้ได้`,
      );
    }

    // คำนวณส่วนลด
    let discountAmount = 0;
    if (coupon.type === CouponType.FIXED) {
      discountAmount = Number(coupon.value);
    } else {
      discountAmount = Math.floor((orderAmount * Number(coupon.value)) / 100);
    }

    return {
      code:     coupon.code,
      type:     coupon.type,
      value:    Number(coupon.value),
      discount: discountAmount,
      label:    coupon.type === CouponType.FIXED
                  ? `ลด ฿${coupon.value}`
                  : `ลด ${coupon.value}%`,
    };
  }

  // ── สร้างคูปองใหม่ (Admin) ────────────────────────────────────────────────
  async createCoupon(data: {
    code: string;
    type: CouponType;
    value: number;
    min_order_amount?: number;
  }) {
    const existing = await this.couponsRepository.findOne({
      where: { code: data.code.trim().toUpperCase() },
    });
    if (existing) {
      throw new BadRequestException('รหัสคูปองนี้มีอยู่แล้ว');
    }

    const coupon = this.couponsRepository.create({
      ...data,
      code: data.code.trim().toUpperCase(),
    });
    return this.couponsRepository.save(coupon);
  }

  // ── ดูคูปองทั้งหมด (Admin) ───────────────────────────────────────────────
  findAll() {
    return this.couponsRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  // ── ปิด/เปิดคูปอง (Admin) ────────────────────────────────────────────────
  async toggleCoupon(id: number) {
    const coupon = await this.couponsRepository.findOneBy({ id });
    if (!coupon) throw new BadRequestException('ไม่พบคูปอง');
    coupon.is_active = !coupon.is_active;
    return this.couponsRepository.save(coupon);
  }
}