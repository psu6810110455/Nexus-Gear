import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 💡 ฟังก์ชันจำลองการดึง User ID (ของจริงจะดึงจาก Token ที่ล็อกอินมา)
  // สมมติว่าตอนนี้ใช้ User ID = 1 ไปก่อน เพื่อให้คุณทดสอบ API ได้เลย
  private getUserId(req: any): number {
    return req.user?.id || 1; 
  }

  @Get()
  getProfile(@Req() req: any) {
    return this.profileService.getProfile(this.getUserId(req));
  }

  @Patch()
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(this.getUserId(req), dto);
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