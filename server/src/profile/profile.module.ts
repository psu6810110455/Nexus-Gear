import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])], // เชื่อมฐานข้อมูล
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}