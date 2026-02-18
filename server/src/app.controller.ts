// server/src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // ✅ API ใหม่: ส่งข้อมูลกราฟยอดขาย (จำลองข้อมูล)
  @Get('sales-data')
  getSalesData() {
    return [
      { name: 'ม.ค.', sales: 4000 },
      { name: 'ก.พ.', sales: 3000 },
      { name: 'มี.ค.', sales: 2000 },
      { name: 'เม.ย.', sales: 2780 },
      { name: 'พ.ค.', sales: 1890 },
      { name: 'มิ.ย.', sales: 2390 },
      { name: 'ก.ค.', sales: 3490 },
    ];
  }
}