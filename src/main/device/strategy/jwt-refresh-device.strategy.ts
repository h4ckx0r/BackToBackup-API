import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshDeviceStrategy extends PassportStrategy(Strategy, 'jwt-refresh-device') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_DEVICE_REFRESH_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_DEVICE_REFRESH_SECRET no está definido en el archivo .env');
    }
    super({
      jwtFromRequest: (req: { query: { refresh_token: string } }): string => req.query.refresh_token,
      ignoreExpiration: true,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { deviceId: string }) {
    return payload;
  }
}
