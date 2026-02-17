// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // หรือ 'mysql' ตามที่คุณตั้งไว้ใน Docker
      host: 'localhost',
      port: 5432,
      username: 'your_username',
      password: 'your_password',
      database: 'nexus_gear_db', // ชื่อโปรเจกต์ของคุณ
      entities: [User],
      synchronize: true, // เฉพาะช่วงพัฒนา: ให้ระบบสร้างตารางใหม่ตาม Entity อัตโนมัติ
    }),
    UsersModule,
  ],
})
export class AppModule {}