import { Controller, Post, Body, Get } from '@nestjs/common'; // ✅ เพิ่ม Get
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ✅ 1. เพิ่มสินค้าลงตะกร้า (ของเดิม)
  @Post('add')
  async addToCart(@Body() body: { productId: number; quantity: number }) {
    // สมมติว่า User ID = 1 (Admin) ไปก่อน
    const userId = 1; 
    
    // เรียกใช้ Service ให้ไปทำงาน
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  // ✅ 2. ดูสินค้าในตะกร้า (เพิ่มใหม่)
  @Get()
  async getCart() {
    const userId = 1; // ใช้ User คนเดิมเพื่อดูตะกร้าของตัวเอง
    return this.cartService.getCart(userId);
  }
}