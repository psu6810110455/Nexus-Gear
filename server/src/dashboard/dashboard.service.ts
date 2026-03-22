import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {
  constructor(private readonly db: DatabaseService) {}

  async getDashboardSummary() {
    // ยอดขายรวม และ จำนวนบิลทั้งหมด
    const summaryResult: any = await this.db.query(
      `SELECT 
        COUNT(id) as totalOrders, 
        COALESCE(SUM(total_price), 0) as totalSales 
       FROM orders`
    );

    // รายการสั่งซื้อล่าสุด 5 รายการ
    const recentOrders: any = await this.db.query(
      `SELECT id, order_number, shipping_address, total_price, status
       FROM orders 
       ORDER BY id DESC 
       LIMIT 5`
    );

    // ยอดขายย้อนหลัง 7 วัน (สำหรับกราฟ)
    const salesChartData: any = await this.db.query(
      `SELECT 
        DATE_FORMAT(created_at, '%d/%m') as label,
        SUM(total_price) as amount
       FROM orders
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
       ORDER BY DATE(created_at) ASC`
    );

    // ยอดขายวันนี้
    const todayResult: any = await this.db.query(
      `SELECT 
        COUNT(id) as todayOrders,
        COALESCE(SUM(total_price), 0) as todaySales
       FROM orders
       WHERE DATE(created_at) = CURDATE()`
    );

    // ยอดขายเมื่อวาน
    const yesterdayResult: any = await this.db.query(
      `SELECT 
        COALESCE(SUM(total_price), 0) as yesterdaySales
       FROM orders
       WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)`
    );

    // สินค้าขายดีที่สุด
    let topProductResult: any = [];
    try {
      topProductResult = await this.db.query(
        `SELECT p.name as productName, SUM(oi.quantity) as totalQty
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY p.id, p.name
         ORDER BY totalQty DESC
         LIMIT 1`
      );
    } catch {
      topProductResult = [];
    }

    // ─── คำนวณ Trend ──────────────────────────────────────────────────────────
    const todaySales     = Number(todayResult[0]?.todaySales)        || 0;
    const todayOrders    = Number(todayResult[0]?.todayOrders)       || 0;
    const yesterdaySales = Number(yesterdayResult[0]?.yesterdaySales) || 0;
    const topProduct     = topProductResult[0]?.productName          || 'N/A';

    let trend: 'up' | 'down' | 'flat' = 'flat';
    let trendPercent = 0;

    if (yesterdaySales > 0) {
      trendPercent = Math.abs(((todaySales - yesterdaySales) / yesterdaySales) * 100);
      if (todaySales > yesterdaySales)      trend = 'up';
      else if (todaySales < yesterdaySales) trend = 'down';
    } else if (todaySales > 0) {
      trend = 'up';
      trendPercent = 100;
    }

    return {
      success: true,
      data: {
        totalOrders:  Number(summaryResult[0]?.totalOrders) || 0,
        totalSales:   Number(summaryResult[0]?.totalSales)  || 0,
        recentOrders: recentOrders,
        salesChart:   salesChartData,
        aiSummary: {
          todaySales,
          todayOrders,
          yesterdaySales,
          topProduct,
          trend,
          trendPercent,
          peakHour: '14:00-16:00',
        },
      },
    };
  }
}