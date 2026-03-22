import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; //  นำเข้า crypto สำหรับสุ่มรหัส Token
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service'; //  นำเข้า MailService
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService, //  Inject MailService เข้ามาใช้งาน
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
        picture: user.picture || null,
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

    // อัปเดตรูปโปรไฟล์ Google ถ้ามี
    if (googleUser.picture && user) {
      user.picture = googleUser.picture;
      await this.usersService.update(user.id, { picture: googleUser.picture });
    }

    //  เพิ่มการเช็กอีกครั้งเพื่อให้ TypeScript มั่นใจว่า user ไม่เป็น null แน่นอน
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
        picture: user.picture || googleUser.picture || null,
      }
    };
  }

  //  3. ฟังก์ชันขอรีเซ็ตรหัสผ่าน (Forgot Password)
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

  //  4. ฟังก์ชันตั้งรหัสผ่านใหม่ (Reset Password)
  async resetPassword(dto: ResetPasswordDto) {
    // 4.1 หา User ที่มี Token ตรงกับที่ส่งมา
    const user = await this.usersService.findByResetToken(dto.token);

    // 4.2 เช็กว่ามี User ไหม และ Token หมดอายุหรือยัง (เอาเวลาปัจจุบันไปเทียบ)
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง หรือหมดอายุแล้วครับ');
    }

    // 4.3 นำรหัสผ่านใหม่ไปเข้ารหัส (Hash)
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // 4.4 บันทึกรหัสผ่านใหม่ลงฐานข้อมูล พร้อมล้าง Token และเวลาหมดอายุทิ้ง
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว! สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลยครับ' };
  }
}