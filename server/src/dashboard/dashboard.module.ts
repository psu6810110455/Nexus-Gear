import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  // ลบ imports: [DatabaseModule] ออก เพราะเราใช้ Database แบบ Global แล้ว
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}