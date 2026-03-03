import { Controller, Post, Body, Get, Delete, Param, Patch } from '@nestjs/common'; // ✅ เพิ่ม Patch ตรงนี้
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

  // ✅ 3. ลบสินค้าออกจากตะกร้า
  @Delete(':itemId')
  async removeFromCart(@Param('itemId') itemId: string) {
    const userId = 1;
    return this.cartService.removeFromCart(userId, Number(itemId));
  }

  // ✅ 4. อัปเดตจำนวนสินค้า (สำหรับปุ่ม + / - ในหน้าเว็บ)
  @Patch(':itemId')
  async updateQuantity(
    @Param('itemId') itemId: string, 
    @Body('quantity') quantity: number
  ) {
    const userId = 1;
    return this.cartService.updateQuantity(userId, Number(itemId), quantity);
  }
}