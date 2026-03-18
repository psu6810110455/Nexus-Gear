// เส้นทาง: server/src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(to: string, token: string) {
    // ลิงก์ที่จะส่งไปให้ลูกค้ากด (ชี้ไปที่หน้าเว็บ React พอร์ต 5173 ของคุณ)
    const resetLink = `https://wd05.pupasoft.com/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to, // อีเมลปลายทาง
      subject: 'รีเซ็ตรหัสผ่านบัญชีของคุณ - Nexus Gear',
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2 style="color: #FF0000;">NEXUS GEAR</h2>
          <h3>สวัสดีครับ,</h3>
          <p>เราได้รับคำขอให้รีเซ็ตรหัสผ่านสำหรับบัญชีของคุณบน Nexus Gear</p>
          <p>กรุณากดปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่ (ลิงก์นี้มีอายุ 15 นาที):</p>
          <a href="${resetLink}" style="padding: 12px 24px; background-color: #FF0000; color: #ffffff; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-top: 10px;">
            เปลี่ยนรหัสผ่านใหม่
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">
            หากคุณไม่ได้เป็นผู้ขอรีเซ็ตรหัสผ่าน กรุณาเพิกเฉยต่ออีเมลฉบับนี้ครับ และรหัสผ่านของคุณจะยังคงปลอดภัย
          </p>
        </div>
      `,
    });
  }
}