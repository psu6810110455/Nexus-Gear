// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // กำหนด URL หลักเป็น http://localhost:3000/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK) // เปลี่ยน Status Code เป็น 200 OK สำหรับการ Login
  @Post('login') // สร้าง API Endpoint: POST /auth/login
  async login(@Body() loginDto: Record<string, any>) {
    // ส่งอีเมลและรหัสผ่านที่รับมาไปเช็คที่ AuthService
    return this.authService.login(loginDto.email, loginDto.password);
  }
}