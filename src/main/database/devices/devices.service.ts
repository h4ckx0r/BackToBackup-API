import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceDto } from '../models/dto/device.dto';
import { DeviceEntity } from '../models/entity/device.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getDevicesByUser(userId: string): Promise<DeviceEntity[]> {
    return this.deviceRepository.find({ where: { owner: { id: userId } } });
  }

  async addNewDevice(userId: string, deviceName: string): Promise<string> {
    const device = await this.deviceRepository.save({ owner: { id: userId }, name: deviceName });
    return this.generateRegisterToken(device);
  }

  generateRegisterToken(device: DeviceEntity): string {
    return this.jwtService.sign({ deviceId: device.id }, { secret: this.configService.get<string>('JWT_REGISTER_DEVICE_SECRET'), expiresIn: '24h' });
  }

  async registerDevice(deviceId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (device?.refresh_token) {
      throw new BadRequestException('El dispositivo ya está registrado');
    } else if (device) {
      device.refresh_token = this.jwtService.sign({ deviceId: device.id }, { secret: this.configService.get<string>('JWT_DEVICE_REFRESH_SECRET') });
      return await this.deviceRepository.save(device);
    } else {
      throw new BadRequestException('El dispositivo no existe');
    }
  }

  async getRefreshToken(deviceId: string): Promise<string | null> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId }, select: ['refresh_token'], cache: true });
    return device?.refresh_token || null;
  }

  async getNewToken(deviceId: string): Promise<string> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId } });
    if (!device) {
      throw new BadRequestException('El dispositivo no existe');
    }
    return this.jwtService.sign({ device: DeviceDto.fromEntity(device) }, { secret: this.configService.get<string>('JWT_DEVICE_REFRESH_SECRET') });
  }

  async getSocketIdByDeviceId(userId: string, deviceId: string): Promise<string | null> {
    const device = await this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.owner', 'owner')
      .where('device.id = :deviceId', { deviceId })
      .andWhere('owner.id = :userId', { userId })
      .select(['device.socketId'])
      .getOne();

    return device?.socketId || null;
  }

  async updateSocketIdByDeviceId(deviceId: string, refresh_token: string, socketId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.findOne({ where: { id: deviceId, refresh_token } });
    if (!device) {
      throw new BadRequestException('El dispositivo no existe');
    }
    device.socketId = socketId;
    return this.deviceRepository.save(device);
  }

  async removeSocketIdByDeviceId(socketId: string): Promise<DeviceEntity> {
    const device = await this.deviceRepository.findOne({ where: { socketId } });
    if (!device) {
      throw new BadRequestException('El dispositivo no existe');
    }
    device.socketId = null;
    return this.deviceRepository.save(device);
  }
}
