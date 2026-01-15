import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRegisterDeviceStrategy extends PassportStrategy(Strategy, 'jwt-register-device') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_REGISTER_DEVICE_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_REGISTER_DEVICE_SECRET no está definido en el archivo .env');
    }
    super({
      jwtFromRequest: (req: { query: { register_token: string } }): string => req.query.register_token,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { deviceId: string }) {
    return payload;
  }
}
