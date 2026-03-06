import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'MY_SUPER_SECRET_KEY', 
    });
  }

  async validate(payload: any) {
    // ถอดรหัสเสร็จ จะแนบข้อมูลนี้ไปกับ Request (req.user)
    return { id: payload.sub, userId: payload.sub, email: payload.email, role: payload.role };
  }
}