import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { DatabaseService } from './database/database.service';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
// ✨ 1. นำเข้า DashboardModule ที่เราเพิ่งสร้าง
import { DashboardModule } from './dashboard/dashboard.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'rootpassword',
      database: 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    CartModule,
    CategoriesModule,
    OrdersModule,
    // ✨ 2. เพิ่ม DashboardModule ลงในระบบหลัก
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class AppModule {}