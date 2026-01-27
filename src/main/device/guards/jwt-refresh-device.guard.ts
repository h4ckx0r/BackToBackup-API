import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevicesService } from 'src/main/database/devices/devices.service';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtRefreshDeviceGuard extends AuthGuard('jwt-refresh-device') implements CanActivate {
  constructor(private readonly devicesService: DevicesService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);
    const payload: FastifyRequest & { query: { refresh_token: string; deviceId: string } } = context.switchToHttp().getRequest();
    if (payload.query.refresh_token == (await this.devicesService.getRefreshToken(payload.query.deviceId))) {
      return true;
    }
    return false;
  }
}
