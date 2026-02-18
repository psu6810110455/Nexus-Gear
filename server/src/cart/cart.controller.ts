import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common'; // ✅ เพิ่ม Delete, Param
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ✅ 1. เพิ่มสินค้าลงตะกร้า (ของเดิม)
  @Post('add')
  async addToCart(@Body() body: { productId: number; quantity: number }) {
    const userId = 1; 
    return this.cartService.addToCart(userId, body.productId, body.quantity);
  }

  // ✅ 2. ดูสินค้าในตะกร้า (ของเดิม)
  @Get()
  async getCart() {
    const userId = 1;
    return this.cartService.getCart(userId);
  }

  // ✅ 3. ลบสินค้าออกจากตะกร้า (เพิ่มใหม่)
  @Delete(':itemId') // รับค่า itemId จาก URL เช่น /cart/5
  async removeFromCart(@Param('itemId') itemId: string) {
    const userId = 1;
    // แปลง itemId เป็นตัวเลขก่อนส่งไปให้ Service
    return this.cartService.removeFromCart(userId, Number(itemId));
  }
}