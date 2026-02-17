// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',            // เปลี่ยนเป็น mysql ตามรูป
      host: 'localhost',
      port: 5433,               // เปลี่ยนเป็น 5433 ตามที่เห็นใน docker ps
      username: 'root',         // โดยปกติของ MySQL ใน Docker มักจะเป็น root
      password: 'rootpassword', // ใส่รหัสผ่านที่คุณตั้งไว้ใน docker-compose
      database: 'ecommerce_db', // ชื่อฐานข้อมูลที่เห็นใน phpMyAdmin
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthModule, // นำ UsersModule เข้ามาใช้งานใน AppModule
    
  ],
})
export class AppModule {}