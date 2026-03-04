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

    return {
      success: true,
      data: {
        totalOrders: summaryResult[0].totalOrders,
        totalSales: summaryResult[0].totalSales,
        recentOrders: recentOrders
      }
    };
  }
}