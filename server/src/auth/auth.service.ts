import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // ✅ นำเข้า crypto สำหรับสุ่มรหัส Token
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service'; // ✅ นำเข้า MailService
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService, // ✅ Inject MailService เข้ามาใช้งาน
  ) {}

  // 1. ฟังก์ชัน Login ปกติ
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // 2. ฟังก์ชัน Google Login
  async googleLogin(googleUser: any) {
    if (!googleUser) {
      throw new UnauthorizedException('ไม่พบข้อมูลจาก Google');
    }

    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        password: Math.random().toString(36).slice(-8) + 'Gg!', 
        role: 'customer',
      });
    }

    if (!user) {
      throw new UnauthorizedException('ระบบไม่สามารถระบุตัวตนผู้ใช้งานได้');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    };
  }

  // ✅ 3. ฟังก์ชันขอรีเซ็ตรหัสผ่าน (Forgot Password)
  async forgotPassword(dto: ForgotPasswordDto) {
    // 3.1 ตรวจสอบว่ามีอีเมลนี้ในระบบไหม
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้ง');
    }

    // 3.2 สร้าง Token ลับแบบสุ่ม (32 ไบต์แปลงเป็นตัวอักษร)
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // 3.3 ตั้งเวลาหมดอายุ (ให้เวลา 15 นาที)
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 15);

    // 3.4 บันทึก Token ลงฐานข้อมูล
    await this.usersService.updateResetToken(user.id, resetToken, expiresIn);

    // 3.5 สั่งให้ MailService ส่งอีเมล
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้วครับ' };
  }
}