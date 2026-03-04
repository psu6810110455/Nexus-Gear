import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getDashboardSummary() {
    // 1. ดึงยอดขายรวม และ จำนวนบิลทั้งหมด
    const summaryResult: any = await this.db.query(
      `SELECT 
        COUNT(id) as totalOrders, 
        COALESCE(SUM(total), 0) as totalSales 
       FROM orders`
    );

    // 2. ดึงรายการสั่งซื้อล่าสุด 5 รายการ (เอาไว้โชว์ในตารางหน้า Dashboard)
    const recentOrders: any = await this.db.query(
      `SELECT id, order_number, shipping_name, total, payment_method
       FROM orders 
       ORDER BY id DESC 
       LIMIT 5`
    );

    // ✨ 3. ดึงยอดขายย้อนหลัง 7 วัน (จัดกลุ่มตามวัน สำหรับทำกราฟ)
    const salesChartData: any = await this.db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%d/%m') as label,
        SUM(total) as amount
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
       ORDER BY DATE(created_at) ASC`
    );

    return {
      success: true,
      data: {
        totalOrders: Number(summaryResult[0]?.totalOrders) || 0,
        totalSales: Number(summaryResult[0]?.totalSales) || 0,
        recentOrders: recentOrders,
        salesChart: salesChartData // ✨ ส่งข้อมูลกราฟออกไปให้หน้าเว็บ
      }
    };
  }
}