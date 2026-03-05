import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'ไม่พบ Token สำหรับอ้างอิง' })
  token: string;

  @IsNotEmpty({ message: 'กรุณากรอกรหัสผ่านใหม่' })
  @MinLength(6, { message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' })
  newPassword: string;
}