// src/app.module.ts
import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { DatabaseService } from './database/database.service'; // ✅ เพิ่มบรรทัดนี้

@Global() // ✅ เพิ่มบรรทัดนี้ (สำคัญมาก! ทำให้ใช้ Database ได้ทุกที่)
@Module({
  imports: [CartModule], 
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService, // ✅ เพิ่มบรรทัดนี้
  ],
  exports: [DatabaseService], // ✅ เพิ่มบรรทัดนี้ (ส่งออกให้ Module อื่นใช้)
})
export class AppModule {}