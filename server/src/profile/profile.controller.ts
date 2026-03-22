import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { ChangePasswordDto } from './dto/change-password.dto'; 
//  1. นำเข้า UseGuards และ JwtAuthGuard 
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; //  หมายเหตุ: เช็ก Path โฟลเดอร์ auth ของคุณให้ตรงด้วยนะครับ

@Controller('profile')
@UseGuards(JwtAuthGuard) //  2. ติดตั้งยาม บังคับว่าต้องมี Token ถึงจะเข้ามาใช้งานได้
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //  3. ดึง ID จาก Token ของจริง (เลิกใช้ || 1 แล้ว)
  private getUserId(req: any): number {
    // โค้ดนี้จะรองรับทั้ง req.user.id, userId หรือ sub (ขึ้นอยู่กับตอนที่คุณสร้าง Token)
    return req.user?.id || req.user?.userId || req.user?.sub; 
  }

  @Get()
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(this.getUserId(req));
  }

  @Patch()
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(this.getUserId(req), dto);
  }

  @Patch('change-password')
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.profileService.changePassword(this.getUserId(req), dto);
  }

  @Get('addresses')
  getAddresses(@Req() req: any) {
    return this.profileService.getAddresses(this.getUserId(req));
  }

  @Post('addresses')
  createAddress(@Req() req: any, @Body() dto: CreateAddressDto) {
    return this.profileService.createAddress(this.getUserId(req), dto);
  }

  @Patch('addresses/:id')
  updateAddress(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.profileService.updateAddress(this.getUserId(req), +id, dto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Req() req: any, @Param('id') id: string) {
    return this.profileService.deleteAddress(this.getUserId(req), +id);
  }
}