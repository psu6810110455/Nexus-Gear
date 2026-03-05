// เส้นทาง: server/src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // ใช้เซิร์ฟเวอร์ของ Gmail
        port: 587,
        secure: false,
        auth: {
          user: 'YOUR_EMAIL@gmail.com', // ⚠️ ใส่อีเมล Gmail ของคุณ (ที่จะใช้เป็นคนส่ง)
          pass: 'YOUR_APP_PASSWORD',    // ⚠️ ใส่ App Password (เดี๋ยวผมบอกวิธีเอาด้านล่างครับ)
        },
      },
      defaults: {
        from: '"Nexus Gear Support" <noreply@nexusgear.com>', // ชื่อคนส่งที่จะโชว์
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // เพื่อให้ Module อื่น (เช่น Auth) เรียกใช้บริการส่งเมลได้
})
export class MailModule {}