import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController }   from './app.controller';
import { AppService }      from './app.service';
import { DatabaseService } from './database/database.service';

import { ProductsModule }   from './products/products.module';
import { AuthModule }        from './auth/auth.module';
import { UsersModule }      from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule }     from './orders/orders.module';
import { DashboardModule }  from './dashboard/dashboard.module';
import { CartModule }        from './cart/cart.module';
import { ProfileModule }    from './profile/profile.module';
import { MailModule }        from './mail/mail.module';
import { PaymentModule }    from './payment/payment.module';
import { ChatModule }        from './chat/chat.module';
import { CouponsModule }    from './coupons/coupons.module';

@Global()
@Module({
  imports: [
    // 1. ตั้งค่าการโหลดไฟล์ .env ให้ฉลาดขึ้น
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),

    // 2. ตั้งค่าไฟล์ Static
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // 3. ตั้งค่า Database ให้ดึงค่าจาก ConfigService (ไม่ Hardcode)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'rootpassword'),
        database: configService.get<string>('DB_NAME', 'ecommerce_db'),
        autoLoadEntities: true,
        synchronize: true, // แนะนำเป็น false ใน production จริงๆ แต่ถ้ากำลังพัฒนาอยู่เปิดไว้ได้ครับ
      }),
    }),

    ProductsModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    OrdersModule,
    DashboardModule,
    CartModule,
    ProfileModule,
    MailModule,
    PaymentModule,
    ChatModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class AppModule {}
