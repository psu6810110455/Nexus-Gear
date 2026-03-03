import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'nexus-gear-secret-key', // ✅ ต้องตรงกับใน auth.module.ts นะครับ!
    });
  }

  async validate(payload: any) {
    // ถอดรหัสเสร็จ จะแนบข้อมูลนี้ไปกับ Request (req.user)
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}