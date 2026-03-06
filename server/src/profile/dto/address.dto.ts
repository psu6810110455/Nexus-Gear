// เส้นทาง: server/src/profile/dto/address.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'กรุณาระบุชื่อเรียกที่อยู่ (เช่น บ้าน, ที่ทำงาน)' })
  @IsString()
  label: string;

  @IsNotEmpty({ message: 'กรุณาระบุรายละเอียดที่อยู่' })
  @IsString()
  address: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}