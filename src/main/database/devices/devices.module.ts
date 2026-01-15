import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from '../models/entity/device.entity';
import { DevicesService } from './devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), JwtModule],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
