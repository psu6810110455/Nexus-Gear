import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

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

    // Update Google profile picture if available
    if (googleUser.picture && user) {
      user.picture = googleUser.picture;
      await this.usersService.update(user.id, { picture: googleUser.picture });
    }

    // Null safety check for TypeScript
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

  async forgotPassword(dto: ForgotPasswordDto) {
    // Validate email exists
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีกครั้ง');
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiration (15 minutes)
    const expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + 15);

    // Save token to database
    await this.usersService.updateResetToken(user.id, resetToken, expiresIn);

    // Send reset email
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณแล้วครับ' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Find user by reset token
    const user = await this.usersService.findByResetToken(dto.token);

    // Validate token and check expiration
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException('ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้อง หรือหมดอายุแล้วครับ');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Save new password and clear reset token
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว! สามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้เลยครับ' };
  }
}