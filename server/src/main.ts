// server/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ แก้ไขจาก enableCORS เป็น enableCors (s เล็ก) ครับ
  app.enableCors({
    origin: 'http://localhost:5173', // พอร์ตของ React
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000); // หลังบ้านรันที่พอร์ต 3000
}
bootstrap();