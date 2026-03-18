// src/orders/orders.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param,
  UseInterceptors, UploadedFile, UseGuards, Request,
  BadRequestException // ✨ 1. เพิ่ม BadRequestException สำหรับเตะไฟล์อันตรายทิ้ง
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ── Customer: Checkout (ต้อง login) ───────────────────────────────────
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('slipImage', {
    // 🛡️ ระบบป้องกันที่ 1: จำกัดขนาดไฟล์ (Max File Size) ป้องกันโจมตีแบบยัดไฟล์ขยะจนดิสก์เต็ม
    limits: {
      fileSize: 5 * 1024 * 1024, // จำกัดสูงสุด 5MB
    },
    // 🛡️ ระบบป้องกันที่ 2: คัดกรองประเภทไฟล์ (File Filter) ดักจับ Malware (.exe, .php, ฯลฯ)
    fileFilter: (req, file, cb) => {
      // เช็ค MIME Type ว่าเป็นรูปภาพเท่านั้น
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        // ถ้าแฮกเกอร์ยิงไฟล์แปลกๆ มา ให้เด้ง Error กลับไปทันที
        return cb(new BadRequestException('ตรวจพบความเสี่ยง: ระบบอนุญาตให้อัปโหลดเฉพาะไฟล์รูปภาพ (JPG, PNG) เท่านั้น!'), false);
      }
      cb(null, true); // ปลอดภัย ให้ผ่านได้
    },
    // 🛡️ ระบบป้องกันที่ 3: สุ่มชื่อไฟล์ใหม่ (Rename) ป้องกันแฮกเกอร์รันสคริปต์ผ่านชื่อไฟล์
    storage: diskStorage({
      destination: './uploads/slips',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'slip-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async checkout(@Body() body: any, @UploadedFile() file: any, @Request() req: any) {
    const userId = req.user.userId;
    const { shippingAddress, paymentMethod } = body;
    const slipFilename  = file ? file.filename : null;

    const stripePaymentIntentId = body.stripePaymentIntentId || null;

    // ✨ รับข้อมูลคูปองจาก FormData
    const couponCode     = body.couponCode     || null;
    const discountAmount = body.discountAmount ? parseFloat(body.discountAmount) : 0;

    return this.ordersService.checkout(
      userId,
      shippingAddress,
      paymentMethod,
      slipFilename,
      stripePaymentIntentId,
      couponCode,      // ✨ ส่งต่อเข้า service
      discountAmount,  // ✨ ส่งต่อเข้า service
    );
  }

  // ── Customer: ดู Order ของตัวเอง (ต้อง login) ─────────────────────────
  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  findMyOrders(@Request() req: any) {
    return this.ordersService.findByUserId(req.user.userId);
  }

  // ── Admin: ดู Order ทั้งหมด ────────────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.ordersService.findAll();
  }

  // ── Admin: ดู Order ของ User ใดก็ได้ ──────────────────────────────────
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findByUserId(@Param('userId') userId: string) {
    return this.ordersService.findByUserId(+userId);
  }

  // ── Login required: ดู Order เดี่ยว ───────────────────────────────────
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // ── Admin: อัปเดตสถานะ ────────────────────────────────────────────────
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(+id, dto.status);
  }

  // ── Admin: Create Order แบบ manual ────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  // ── Customer: ส่งรีวิว + คะแนนดาว ────────────────────────────────────
  @Post(':id/rating')
  @UseGuards(JwtAuthGuard)
  submitRating(
    @Param('id') id: string,
    @Body() body: { ratings: Record<number, number>; reviews?: Record<number, string> },
  ) {
    return this.ordersService.submitRating(+id, body.ratings, body.reviews ?? {});
  }

  // ── Customer: ยกเลิกคำสั่งซื้อ (เฉพาะ pending / paid) ─────────────────
  // restock = true คือสินค้าจะถูกเพิ่มกลับเข้า stock โดยอัตโนมัติ
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(
    @Param('id') id: string,
    @Body() body: { reason: string; restock?: boolean; bankName?: string; bankAccount?: string }
  ) {
    // ค่า default restock = true (คืนสต็อกเสมอ)
    return this.ordersService.cancelOrder(+id, body.reason, body.restock !== false, body.bankName, body.bankAccount);
  }

  // ── Admin: คืนเงินลูกค้า ──────────────────────────────────────────────────
  @Patch(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('refundSlip', {
    storage: diskStorage({
      destination: './uploads/slips',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'refund-' + uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async processRefund(
    @Param('id') id: string,
    @Body() body: { refundAmount: string; refundChannel: string },
    @UploadedFile() file: any,
  ) {
    const refundSlip = file ? file.filename : null;
    return this.ordersService.processRefund(
      +id,
      parseFloat(body.refundAmount),
      body.refundChannel,
      refundSlip,
    );
  }

  // ── Customer: ขอคืนสินค้า (ภายใน 3 วันหลัง completed) ─────────────────
  @Patch(':id/return')
  @UseGuards(JwtAuthGuard)
  requestReturn(
    @Param('id') id: string,
    @Body() body: { reason: string; bankName?: string; bankAccount?: string },
  ) {
    return this.ordersService.requestReturn(+id, body.reason, body.bankName, body.bankAccount);
  }

  // ── Customer: ส่งข้อมูลการคืนเงิน (สำหรับ cancelled) ────────────
  @Patch(':id/refund-info')
  @UseGuards(JwtAuthGuard)
  submitRefundInfo(
    @Param('id') id: string,
    @Body() body: { bankName: string; bankAccount: string },
  ) {
    return this.ordersService.submitRefundInfo(+id, body.bankName, body.bankAccount);
  }

  // ── Admin: ปฏิเสธการคืนเงิน (สลิปปลอม) ──────────────────────────────────
  @Patch(':id/reject-refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  rejectRefund(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.ordersService.rejectRefund(+id, body.reason);
  }
}