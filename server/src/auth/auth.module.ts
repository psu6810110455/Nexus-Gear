// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // นำเข้า UsersModule เพื่อให้เช็ค Email ในฐานข้อมูล SQL ได้
    PassportModule,
    JwtModule.register({
      secret: 'MY_SUPER_SECRET_KEY', // 👈 ในงานจริงควรใส่ใน .env นะครับ
      signOptions: { expiresIn: '1d' }, // บัตรผ่านมีอายุ 1 วัน
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}