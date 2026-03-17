import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController }   from './app.controller';
import { AppService }      from './app.service';
import { DatabaseService } from './database/database.service';

import { ProductsModule }   from './products/products.module';
import { AuthModule }       from './auth/auth.module';
import { UsersModule }      from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule }     from './orders/orders.module';
import { DashboardModule }  from './dashboard/dashboard.module';
import { CartModule }       from './cart/cart.module';
import { ProfileModule }    from './profile/profile.module';
import { MailModule }       from './mail/mail.module';
import { PaymentModule }    from './payment/payment.module';
import { ChatModule }       from './chat/chat.module';
import { CouponsModule }    from './coupons/coupons.module'; // ✨ เพิ่มใหม่

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot({
      type:             'mysql',
      host:             '127.0.0.1',
      port:             5433,
      username:         'root',
      password:         'rootpassword',
      database:         'ecommerce_db',
      autoLoadEntities: true,
      synchronize:      true,
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
    CouponsModule, // ✨ เพิ่มใหม่
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
  ],
  exports: [DatabaseService],
})
export class AppModule {}