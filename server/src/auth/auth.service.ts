// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. หา User จาก Email ในฐานข้อมูล MySQL
    const user = await this.usersService.findOneByEmail(email);

    // 2. ถ้าเจอ User ให้เช็คว่ารหัสผ่านที่พิมพ์มา ตรงกับที่โดน Hash ไว้ไหม
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload), // ส่งบัตรผ่าน (JWT) กลับไป
        user: { id: user.id, email: user.email, username: user.username }
      };
    }
    
    // 3. ถ้าไม่ถูกให้แจ้งเตือนว่าไม่มีสิทธิ์เข้าถึง
    throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้องครับ');
  }
}