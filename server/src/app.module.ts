import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseService } from './database/database.service';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CartModule } from './cart/cart.module'; // ✨ เพิ่มใหม่
import { ProfileModule } from './profile/profile.module';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 5433,           // ✅ ตรงกับ docker-compose.yml ที่ map 5433:3306
      username: 'root',
      password: 'rootpassword',
      database: 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    DashboardModule,
    CartModule,             // ✨ เพิ่มใหม่
    ProfileModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class AppModule {}