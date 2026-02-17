import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ 1. เพิ่มการตั้งค่า CORS ตรงนี้ (สำคัญมาก!)
  app.enableCors({
    origin: '*', // อนุญาตให้ทุกเว็บเข้าถึง (หรือจะใส่ 'http://localhost:5173' ก็ได้)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  
  // เริ่มรัน Server
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();