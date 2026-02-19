// src/users/users.controller.ts
import { 
  Controller, 
  Post, 
  Body, 
  Get,             // เพิ่ม Get สำหรับดึงข้อมูล
  UseGuards,       // เพิ่ม UseGuards เพื่อใช้ระบบยาม
  Request,         // เพิ่ม Request เพื่อดึงข้อมูล User จาก Token
  ConflictException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport'; // เพิ่มการนำเข้า AuthGuard

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.register(createUserDto);
      const { password, ...result } = user;
      return {
        message: 'สมัครสมาชิกสำเร็จ!',
        user: result,
      };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('อีเมลนี้ถูกใช้งานไปแล้วครับ');
      }
      console.error("🔥 ERROR ของจริงคือ: ", error);
      throw new InternalServerErrorException('เกิดข้อผิดพลาดบางอย่างในระบบ');
    }
  }

  // --- ส่วนที่เพิ่มใหม่: หน้าที่ต้องมีบัตรผ่าน (JWT) ถึงจะเข้าได้ ---

  @UseGuards(AuthGuard('jwt')) // ใช้ยามตรวจบัตร JWT ก่อนอนุญาตให้เข้าฟังก์ชันนี้
  @Get('profile')
  getProfile(@Request() req: any) {
    // ข้อมูล User จะถูกแกะมาจาก Token และใส่ไว้ใน req.user อัตโนมัติ
    return {
      message: 'ยินดีต้อนรับสมาชิก Nexus Gear',
      user: req.user,
    };
  }
}