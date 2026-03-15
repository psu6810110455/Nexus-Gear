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
      const newQuantity = Number(item.quantity) + Number(quantity);
      
      await this.db.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, item.id],
      );
      return { message: 'อัปเดตจำนวนสินค้าเรียบร้อย', cartItemId: item.id };
    } else {
      // 🔵 กรณี B: ยังไม่มีของ -> เพิ่มแถวใหม่ (Insert)
      const result: any = await this.db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, Number(quantity)],
      );
      return { message: 'เพิ่มสินค้าลงตะกร้าสำเร็จ', cartItemId: result.insertId };
    }
  }

  // ✅ ฟังก์ชันที่ 2: ดึงข้อมูลสินค้าในตะกร้า (getCart)
  async getCart(userId: number) {
    const sql = `
      SELECT 
        cart_items.id AS id,                  -- ✨ แก้ตรงนี้! ส่งออกไปในชื่อ id เพื่อให้หน้าบ้านจับคู่ได้ถูกต้อง
        products.id AS product_id,
        products.name,
        products.price,
        products.image_url AS imageUrl,       -- ✨ แก้ตรงนี้เผื่อไว้ เพื่อให้หน้าบ้านดึงรูปไปโชว์ได้เป๊ะๆ
        cart_items.quantity,
        (products.price * cart_items.quantity) AS total_price
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
    `;
    // ส่ง User ID ไปเพื่อดึงเฉพาะตะกร้าของคนนั้น
    return this.db.query(sql, [userId]);
  }

  // ✅ ฟังก์ชันที่ 3: ลบสินค้าออกจากตะกร้า (removeFromCart)
  async removeFromCart(userId: number, cartItemId: number) {
    // ลบเฉพาะรายการที่เป็นของ User คนนี้เท่านั้น (เพื่อความปลอดภัย)
    await this.db.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, userId],
    );
    return { message: 'ลบสินค้าออกจากตะกร้าเรียบร้อย' };
  }

  // ✅ ฟังก์ชันที่ 4: อัปเดตจำนวนสินค้า (updateQuantity)
  async updateQuantity(userId: number, cartItemId: number, quantity: number) {
    // อัปเดตจำนวน (quantity) โดยอ้างอิงจาก ID ของตะกร้า และเช็คความปลอดภัยด้วย User ID
    await this.db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartItemId, userId],
    );
    return { message: 'อัปเดตจำนวนสินค้าเรียบร้อย' };
  }
}