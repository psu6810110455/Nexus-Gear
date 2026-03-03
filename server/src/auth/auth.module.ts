import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy'; // ✅ 1. Import แผนที่ Google เข้ามา
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    JwtModule.register({
      secret: 'nexus-gear-secret-key', // ✅ ใน production ให้ใช้ process.env.JWT_SECRET แทน
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy], // ✅ 2. เพิ่ม GoogleStrategy ลงใน providers
  controllers: [AuthController],
})
export class AuthModule {}