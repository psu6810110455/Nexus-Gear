import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Address } from './entities/address.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { ChangePasswordDto } from './dto/change-password.dto'; // ✅ 1. นำเข้า DTO ใหม่
import * as bcrypt from 'bcrypt'; // ✅ 2. นำเข้า bcrypt สำหรับเข้ารหัสผ่าน

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  // 1. ดึงข้อมูลส่วนตัว (ไม่ดึงรหัสผ่านออกมา)
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'email', 'phone', 'bank_name', 'bank_account'], 
    });
    if (!user) throw new NotFoundException('ไม่พบข้อมูลผู้ใช้');
    return user;
  }

  // 2. อัปเดตข้อมูลส่วนตัว
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    await this.userRepository.update(userId, dto);
    return this.getProfile(userId);
  }

  // ✅ 3. ฟังก์ชันเปลี่ยนรหัสผ่าน
  async changePassword(userId: number, dto: ChangePasswordDto) {
    // 3.1 หา User ในฐานข้อมูล (ต้องดึงฟิลด์ password ออกมาเช็กด้วย)
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'], // บังคับให้ดึง password ออกมาตรวจสอบ
    });

    if (!user) throw new NotFoundException('ไม่พบผู้ใช้งานในระบบ');

    // 3.2 ตรวจสอบว่า "รหัสผ่านเก่า" ที่พิมพ์มา ตรงกับที่โดนเข้ารหัสไว้ใน DB หรือไม่
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    }

    // 3.3 ถ้ารหัสผ่านเก่าถูก ก็เอารหัสผ่านใหม่มาเข้ารหัส (Hash)
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    // 3.4 บันทึกรหัสผ่านใหม่ที่เข้ารหัสแล้วลง Database
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'อัปเดตรหัสผ่านสำเร็จเรียบร้อย' };
  }

  // 4. ดึงที่อยู่ทั้งหมดของผู้ใช้
  async getAddresses(userId: number) {
    return this.addressRepository.find({ where: { userId }, order: { id: 'DESC' } });
  }

  // 5. เพิ่มที่อยู่ใหม่
  async createAddress(userId: number, dto: CreateAddressDto) {
    // ถ้าตั้งเป็นค่าเริ่มต้น (Default) ต้องไปปลด Default ของที่อยู่อื่นออกก่อน
    if (dto.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    const newAddress = this.addressRepository.create({ ...dto, userId });
    return this.addressRepository.save(newAddress);
  }

  // 6. อัปเดตที่อยู่
  async updateAddress(userId: number, addressId: number, dto: UpdateAddressDto) {
    if (dto.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false });
    }
    await this.addressRepository.update({ id: addressId, userId }, dto);
    return this.addressRepository.findOne({ where: { id: addressId } });
  }

  // 7. ลบที่อยู่
  async deleteAddress(userId: number, addressId: number) {
    const result = await this.addressRepository.delete({ id: addressId, userId });
    if (result.affected === 0) throw new NotFoundException('ไม่พบที่อยู่ที่ต้องการลบ');
    return { message: 'ลบที่อยู่สำเร็จ' };
  }
}