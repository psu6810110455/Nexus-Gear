import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'MY_SUPER_SECRET_KEY', 
    });
  }

  async validate(payload: any) {
    // ดึงข้อมูล User เต็มจาก DB เพื่อให้ได้ name, picture ด้วย
    const user = await this.usersService.findById(payload.sub);
    return { 
      id: payload.sub, 
      userId: payload.sub, 
      email: payload.email, 
      role: payload.role,
      name: user?.name || '',
      picture: user?.picture || null,
    };
  }
}