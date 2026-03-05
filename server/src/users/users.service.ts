import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    // ✅ เช็คว่าอีเมลซ้ำหรือยัง
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password: hashed,
    });
    await this.usersRepository.save(user);

    return { message: 'สมัครสมาชิกสำเร็จ' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // ✅ แก้จาก data: any เป็น data: Partial<User> เพื่อป้องกัน TypeORM สร้างเป็น Array
  async create(data: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(data);
    return await this.usersRepository.save(newUser);
  }

  // ✅ เพิ่มฟังก์ชันสำหรับอัปเดต Token รีเซ็ตรหัสผ่าน
  async updateResetToken(userId: number, token: string | null, expires: Date | null) {
    await this.usersRepository.update(userId, { // แก้ไขเป็น usersRepository แล้ว
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
  } // ✅ ปิดฟังก์ชัน updateResetToken
} // ✅ ปิดคลาส UsersService