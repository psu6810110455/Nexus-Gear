// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, username } = createUserDto;
    
    // 1. เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. สร้าง Instance แบบระบุตัวตนชัดเจน (ช่วยให้ TS ไม่สับสนครับ)
    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.password = hashedPassword;

    // 3. บันทึกข้อมูล (ลบ create() ออกไปก่อนเพื่อเช็ค Type ครับ)
    return await this.usersRepository.save(newUser);
  }

  // แก้ Error ในรูป image_32339c.png โดยใช้ null และระบุ findOne แบบชัดเจนครับ
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ 
      where: { email: email } 
    });
    return user;
  }
}