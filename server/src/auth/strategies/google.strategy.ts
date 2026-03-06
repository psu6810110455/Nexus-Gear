// เส้นทาง: server/src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      // เติมเครื่องหมาย ! ต่อท้าย process.env ทุกตัวครับ
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'], 
    });
  }

  // ฟังก์ชันนี้จะทำงานอัตโนมัติเมื่อ Google ส่งข้อมูลกลับมาให้เรา
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    
    // จัดรูปแบบข้อมูลที่ได้จาก Google ให้อ่านง่ายๆ
    const user = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    };
    
    // ส่งข้อมูล user นี้ไปให้ auth.service.ts ทำงานต่อ
    done(null, user);
  }
}