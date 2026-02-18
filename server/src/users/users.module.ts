// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // นำ User Entity เข้ามาใช้งาน
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export เพื่อให้ AuthModule เรียกใช้ได้ในภายหลัง
})
export class UsersModule {}