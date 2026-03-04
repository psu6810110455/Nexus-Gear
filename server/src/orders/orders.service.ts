import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}
  
  // ✨ เพิ่ม parameter slipImage มารับค่าชื่อไฟล์
  async createOrder(userId: number, shippingAddress: string, paymentMethod: string, slipImage: string | null) {
    // 1. ดึงข้อมูลสินค้าจากตะกร้า
    const cartItems: any = await this.db.query(
      `SELECT c.product_id, c.quantity, p.price, p.name 
       FROM cart_items c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('ตะกร้าสินค้าว่างเปล่า ไม่สามารถสั่งซื้อได้');
    }

    let total = 0;
    for (const item of cartItems) {
      total += (item.price * item.quantity);
    }

    const orderNumber = 'ORD-' + Date.now();
    const shippingName = 'ลูกค้า ทดสอบ'; // ตรงนี้ในอนาคตดึงจาก User ได้ครับ
    const shippingPhone = '080-000-0000';

    // 2. สร้างบิลหลัก ✨ เพิ่มคอลัมน์ slip_image และ Value ของมันเข้าไปด้วย
    const orderResult: any = await this.db.query(
      `INSERT INTO orders 
      (order_number, user_id, shipping_name, shipping_phone, shipping_address, subtotal, total, payment_method, slip_image) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderNumber, userId, shippingName, shippingPhone, shippingAddress, total, total, paymentMethod, slipImage]
    );
    const orderId = orderResult.insertId;

    // 3. 📍 บันทึกรายการสินค้า และ ✨ ตัดสต็อก!
    for (const item of cartItems) {
      // 3.1 บันทึกลงตาราง order_items
      await this.db.query(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.name, item.quantity, item.price]
      );

      // ✨ 3.2 อัปเดตตาราง products เพื่อหักสต็อกสินค้า
      await this.db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // 4. บันทึกการจ่ายเงิน
    await this.db.query(
      'INSERT INTO payments (order_id, payment_method, amount, status) VALUES (?, ?, ?, ?)',
      [orderId, paymentMethod, total, 'pending']
    );

    // 5. ล้างตะกร้า
    await this.db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    return {
      success: true,
      message: "สั่งซื้อและตัดสต็อกสินค้าสำเร็จ!",
      orderId: orderId,
      orderNumber: orderNumber,
      totalAmount: total
    };
  }
}