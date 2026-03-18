import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
// ✨ เพิ่ม Import สำหรับตรวจสอบความถูกต้องของข้อมูล
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

// ✨ ใส่ Decorators ให้ NestJS รู้ว่านี่คือข้อมูลที่ถูกต้อง
export class CreateIntentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  orderId: string;
}

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // POST /api/payments/create-intent
  // Frontend เรียกตอนเลือกวิธีชำระเงิน QR
  @Post('create-intent')
  createIntent(@Body() dto: CreateIntentDto) {
    return this.paymentService.createPromptPayIntent(dto.amount, dto.orderId);
  }

  // GET /api/payments/status/:id
  // Frontend poll ทุก 3 วินาที เพื่อเช็คว่าจ่ายแล้วหรือยัง
  @Get('status/:id')
  getStatus(@Param('id') id: string) {
    return this.paymentService.getPaymentStatus(id);
  }

  // POST /api/payments/simulate-success/:id
  // [DEMO] ปุ่มจำลองการชำระเงิน สำหรับ Present งาน
  @Post('simulate-success/:id')
  simulateSuccess(@Param('id') id: string) {
    return this.paymentService.simulatePaymentSuccess(id);
  }
}