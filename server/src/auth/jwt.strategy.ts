// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // ดึง JWT ออกจาก Header ที่ชื่อว่า Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // ถ้าบัตรหมดอายุแล้ว ให้เตะออกทันที
      secretOrKey: 'MY_SUPER_SECRET_KEY', // 👈 ต้องตรงกับที่ตั้งไว้ใน AuthModule นะครับ
    });
  }

  async validate(payload: any) {
    // ข้อมูลที่ถูกแกะออกมาจาก Token จะมาอยู่ที่นี่
    return { userId: payload.sub, email: payload.email };
  }
}