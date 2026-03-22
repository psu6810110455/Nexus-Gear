import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //  POST /auth/login  ← ตรงกับที่ frontend Login.tsx เรียก
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ---------------------------------------------------------
  //  เส้นทางสำหรับ Google OAuth
  // ---------------------------------------------------------

  // 1. รับการกดปุ่มจากหน้าเว็บ (GET /auth/google) แล้วพาไปหน้าล็อกอิน Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // ปล่อยว่างไว้ได้เลยครับ เดี๋ยว Passport.js จะทำหน้าที่ Redirect ให้เอง
  }

  // 2. รับข้อมูลกลับมาจาก Google (GET /auth/google/callback)
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    // ส่งข้อมูล User ที่ได้จาก Google ไปให้ AuthService สร้าง Token หรือ User ใหม่
    const result = await this.authService.googleLogin(req.user);
    
    // พาสร้าง Token เสร็จ ให้เด้งกลับไปที่หน้า React ของเรา พร้อมแนบ Token ไปด้วย
    const frontendUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login-success?token=${result.access_token}`;
    return res.redirect(frontendUrl);
  }

  // ---------------------------------------------------------
  //  เส้นทางสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน (ด้วย JWT Token)
  // ---------------------------------------------------------
  @Get('me')
  @UseGuards(AuthGuard('jwt')) //  ใช้ JWT Guard เพื่อป้องกันคนไม่มี Token
  getProfile(@Req() req) {
    // คืนค่าข้อมูล User ที่ถอดรหัสได้จาก Token กลับไปให้ Frontend (AuthContext)
    return req.user;
  }

  //  เพิ่ม Endpoint สำหรับขอรีเซ็ตรหัสผ่าน
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
