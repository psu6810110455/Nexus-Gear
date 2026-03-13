import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ConfigModule } from '@nestjs/config'; // ✨ เพิ่มตัวนี้

@Module({
  imports: [ConfigModule], // ✨ ต้องใส่ตรงนี้ Service ถึงจะอ่าน .env ได้
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}