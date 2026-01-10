import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DevicesService } from 'src/main/database/devices/devices.service';

@Injectable()
export class JwtRefreshDeviceGuard extends AuthGuard('jwt-refresh-device') implements CanActivate {
  constructor(private readonly devicesService: DevicesService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const payload: Request = context.switchToHttp().getRequest();
    if (payload.query.refresh_token == (await this.devicesService.getRefreshToken(payload.query.deviceId as string))) {
      return true;
    }
    return false;
  }
}
