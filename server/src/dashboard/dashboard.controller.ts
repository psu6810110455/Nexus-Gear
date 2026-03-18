import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // เมื่อหน้าเว็บเรียก GET /api/dashboard/summary จะวิ่งมาทำงานตรงนี้
  @Get('summary')
  async getSummary() {
    return this.dashboardService.getDashboardSummary();
  }
}