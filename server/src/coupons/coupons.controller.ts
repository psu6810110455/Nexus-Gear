import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponType } from './coupon.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

class ValidateCouponDto {
  code: string;
  orderAmount?: number;
}

class CreateCouponDto {
  code: string;
  type: CouponType;
  value: number;
  min_order_amount?: number;
}

@Controller('api/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // ── POST /api/coupons/validate ────────────────────────────────────────────
  // Frontend เรียกตอนกรอกโค้ดคูปองในหน้าตะกร้า (ต้อง login)
  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(dto.code, dto.orderAmount ?? 0);
  }

  // ── GET /api/coupons ──────────────────────────────────────────────────────
  // Admin ดูคูปองทั้งหมด
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.couponsService.findAll();
  }

  // ── POST /api/coupons ─────────────────────────────────────────────────────
  // Admin สร้างคูปองใหม่
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  // ── PATCH /api/coupons/:id/toggle ─────────────────────────────────────────
  // Admin ปิด/เปิดคูปอง
  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggle(@Param('id') id: string) {
    return this.couponsService.toggleCoupon(+id);
  }
}