import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { CouponsService } from './coupons.service';
import { CouponType } from './coupon.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

class ValidateCouponDto {
  @IsString()
  code: string;

  @IsOptional()
  @IsNumber()
  orderAmount?: number;
}

class CreateCouponDto {
  @IsString()
  code: string;

  @IsString()
  type: CouponType;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  min_order_amount?: number;
}

@Controller('api/coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(dto.code, dto.orderAmount ?? 0);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.couponsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.createCoupon(dto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  toggle(@Param('id') id: string) {
    return this.couponsService.toggleCoupon(+id);
  }
}