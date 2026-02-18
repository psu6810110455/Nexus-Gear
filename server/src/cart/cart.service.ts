// src/cart/cart.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}

  // ✅ ฟังก์ชันที่ 1: เพิ่มสินค้าลงตะกร้า (addToCart)
  async addToCart(userId: number, productId: number, quantity: number) {
    // 1. เช็คก่อนว่า User นี้เคยมีสินค้านี้ในตะกร้าหรือยัง?
    const existingItems = await this.db.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId],
    );

    if (Array.isArray(existingItems) && existingItems.length > 0) {
      // 🟢 กรณี A: มีของอยู่แล้ว -> ให้บวกจำนวนเพิ่ม
      const item = existingItems[0] as any;
      const newQuantity = item.quantity + quantity;
      
      await this.db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, item.id],
      );
      return { message: 'อัปเดตจำนวนสินค้าเรียบร้อย', cartItemId: item.id };
    } else {
      // 🔵 กรณี B: ยังไม่มีของ -> เพิ่มแถวใหม่ (Insert)
      const result: any = await this.db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity],
      );
      return { message: 'เพิ่มสินค้าลงตะกร้าสำเร็จ', cartItemId: result.insertId };
    }
  }
}