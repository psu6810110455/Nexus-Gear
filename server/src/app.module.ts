import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. ตั้งค่าการเชื่อมต่อ Database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5433,              // Port Docker
      username: 'root',
      password: 'rootpassword',
      database: 'ecommerce_db',
      autoLoadEntities: true,  // โหลด Entity ทุกตัว (User, Product) อัตโนมัติ
      synchronize: true,       // true = ให้แก้ตารางใน DB ตามโค้ดอัตโนมัติ (เหมาะกับตอน Dev/Demo)
    }),

    // 2. รวม Feature Modules ทั้งหมด
    ProductsModule, // ระบบสินค้า
    UsersModule,    // ระบบจัดการ user
    AuthModule,     // ระบบ Login/Register
  ],
})
export class AppModule {}