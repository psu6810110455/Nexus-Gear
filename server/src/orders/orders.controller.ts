import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  async checkout(@Body() body: any) {
    // รับข้อมูล ที่อยู่ และ วิธีจ่ายเงิน ที่ส่งมาจาก Postman หรือหน้าเว็บ
    const { userId = 1, shippingAddress, paymentMethod } = body;
    
    // ส่งข้อมูลไปให้ Service ทำงานต่อ
    return this.ordersService.createOrder(userId, shippingAddress, paymentMethod);
  }
}