import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRegisterDeviceGuard extends AuthGuard('jwt-register-device') {}
