import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
// 1️⃣ เปลี่ยนมาดึงตัว DatabaseService ตรงๆ แทน
import { DatabaseService } from '../database/database.service';

@Module({
  // 2️⃣ เอา DatabaseService มาเสียบปลั๊กในช่อง providers แทนครับ
  providers: [OrdersService, DatabaseService], 
  controllers: [OrdersController]
})
export class OrdersModule {}