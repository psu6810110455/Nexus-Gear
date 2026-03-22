import * as dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });


import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. ตั้งค่า CORS ให้ดึงจาก .env เท่านั้น
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. ตั้งค่า Validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // 3. Static file serving
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), { prefix: '/uploads' });

  // 4. รัน Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(` Application is running on: ${await app.getUrl()}`);
}
bootstrap();
