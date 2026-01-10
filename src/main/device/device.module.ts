import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DevicesModule } from '../database/devices/devices.module';
import { DeviceController } from './controllers/device.controller';
import { DeviceGateway } from './gateway/device.gateway';
import { JwtRegisterDeviceStrategy } from './strategy/jwt-register-device.strategy';

@Module({
  imports: [DevicesModule, JwtModule],
  providers: [DeviceGateway, JwtRegisterDeviceStrategy],
  controllers: [DeviceController],
})
export class DeviceModule {}
