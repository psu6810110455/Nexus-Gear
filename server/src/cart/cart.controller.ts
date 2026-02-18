// src/cart/cart.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ✅ เปิดประตูรับคำสั่ง POST /cart/add
  @Post('add')
  async addToCart(@Body() body: { productId: number; quantity: number }) {
    // สมมติว่า User ID = 1 (Admin) ไปก่อน
    // เพราะเรายังไม่มีระบบ Login ที่สมบูรณ์ 100% ในตอนนี้
    const userId = 1; 
    
    // เรียกใช้ Service ให้ไปทำงาน
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }
}