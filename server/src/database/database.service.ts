// src/database/database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  async onModuleInit() {
    // สร้าง Connection Pool ทันทีที่ App เริ่มทำงาน
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'rootpassword',
      database: process.env.DB_NAME || 'ecommerce_db',
      port: Number(process.env.DB_PORT) || 5433,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('🔌 Database Connected (Service Ready)');
  }

  async onModuleDestroy() {
    // ปิดการเชื่อมต่อเมื่อ App หยุดทำงาน
    if (this.pool) {
      await this.pool.end();
    }
  }

  // ฟังก์ชันพระเอก: รับ SQL ไปรันใน Database
  async query(sql: string, params?: any[]) {
    const [results] = await this.pool.execute(sql, params);
    return results;
  }
}