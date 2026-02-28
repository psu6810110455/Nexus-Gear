import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,           // ✅ แก้: MySQL ใช้ port 3306 ไม่ใช่ 5433
      username: 'root',
      password: 'rootpassword',
      database: 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,    // ✅ เปิด synchronize เพื่อให้ TypeORM สร้าง table users อัตโนมัติ
                            //    (ปิดใน production แล้วใช้ migration แทน)
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
  ],
})
export class AppModule {}