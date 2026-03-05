import { Controller, Post, Body, Get, Delete, Param, Patch } from '@nestjs/common'; 
import { CartService } from './cart.service';

// 🚀 [จุดที่แก้ไข]: เปลี่ยนจาก 'cart' เป็น 'api/cart' 
// เพื่อให้บ้านเลขที่ตรงกับที่หน้าเว็บ React (Frontend) เรียกหาครับ
@Controller('api/cart')
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

  // ✅ 3. ลบสินค้าออกจากตะกร้า (ของเดิม)
  @Delete(':itemId')
  async removeFromCart(@Param('itemId') itemId: string) {
    const userId = 1;
    return this.cartService.removeFromCart(userId, Number(itemId));
  }

  // ✅ 4. อัปเดตจำนวนสินค้า (สำหรับปุ่ม + / - ในหน้าเว็บ) (ของเดิม)
  @Patch(':itemId')
  async updateQuantity(
    @Param('itemId') itemId: string, 
    @Body('quantity') quantity: number
  ) {
    const userId = 1;
    return this.cartService.updateQuantity(userId, Number(itemId), quantity);
  }
}