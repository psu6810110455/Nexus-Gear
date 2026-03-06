import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  // 2. ฟังก์ชัน Google Login (แก้ไขเพื่อหลีกเลี่ยง error 'user is possibly null')
  async googleLogin(googleUser: any) {
    if (!googleUser) {
      throw new UnauthorizedException('ไม่พบข้อมูลจาก Google');
    }

    // ค้นหา User จากอีเมลที่ Google ส่งมา
    let user = await this.usersService.findByEmail(googleUser.email);

    // ถ้าไม่มี User ในระบบ ให้สร้างใหม่ทันที
    if (!user) {
      user = await this.usersService.create({
        email: googleUser.email,
        name: googleUser.name,
        // รหัสผ่านสุ่มสำหรับ OAuth User
        password: Math.random().toString(36).slice(-8) + 'Gg!', 
        role: 'customer',
      });
    }

    // ✅ เพิ่มการเช็กอีกครั้งเพื่อให้ TypeScript มั่นใจว่า user ไม่เป็น null แน่นอน
    if (!user) {
      throw new UnauthorizedException('ระบบไม่สามารถระบุตัวตนผู้ใช้งานได้');
    }

    // สร้าง JWT Payload
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
}