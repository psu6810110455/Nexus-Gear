import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ตั้งค่า CORS (สำคัญมาก! เพื่อให้ React คุยกับ NestJS ได้)
  app.enableCors({
    origin: 'http://localhost:5173', // อนุญาตเฉพาะ Frontend ของเรา (Vite)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // อนุญาตให้ส่ง Cookie/Session มาได้ (จำเป็นสำหรับ Login)
  });

  // 2. ตั้งค่า Validation (ตรวจสอบข้อมูลขาเข้า)
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // แปลง type อัตโนมัติ (เช่น string -> number)
    whitelist: true, // ตัด field แปลกปลอมทิ้ง
  }));
  
  // 3. รัน Server 
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();