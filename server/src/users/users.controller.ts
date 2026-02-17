// src/users/users.controller.ts
import { Controller, Post, Body, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // กำหนดว่าทุก Route ในไฟล์นี้จะขึ้นต้นด้วย /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // สร้าง API Endpoint สำหรับการสมัครสมาชิก: POST /users/register
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      // รับข้อมูลจาก Body ของ Request และส่งต่อให้ Service ทำงาน
      const user = await this.usersService.register(createUserDto);
      
      // ส่งค่ากลับไปบอก Frontend ว่าสร้างสำเร็จ (ลบ password ออกก่อนส่งกลับเพื่อความปลอดภัย)
      const { password, ...result } = user;
      return {
        message: 'สมัครสมาชิกสำเร็จ!',
        user: result,
      };
    } catch (error) {
      // ตรวจสอบถ้าอีเมลซ้ำ (MySQL Error Code: 1062)
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('อีเมลนี้ถูกใช้งานไปแล้วครับ');
      }
      throw new InternalServerErrorException('เกิดข้อผิดพลาดบางอย่างในระบบ');
    }
  }
}