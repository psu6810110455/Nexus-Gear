import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ 1. เปิด CORS: อนุญาตให้ Frontend ยิง API เข้ามาได้ (จำเป็นมากตอนทำหน้าเว็บ)
  app.enableCors();

  // ✅ 2. เริ่มรัน Server
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();