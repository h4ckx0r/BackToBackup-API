import { Body, Controller, Get, HttpCode, NotFoundException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiProduces, ApiQuery } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from 'src/main/auth/guards/jwt-auth.guard';
import { DevicesService } from '../../database/devices/devices.service';
import { DeviceDto } from '../../database/models/dto/device.dto';
import { UserDto } from '../../database/models/dto/user.dto';
import { FileDto } from '../dto/file.dto';
import { NewDeviceDto } from '../dto/newDevice.dto';
import { DeviceGateway } from '../gateway/device.gateway';
import { JwtRefreshDeviceGuard } from '../guards/jwt-refresh-device.guard';
import { JwtRegisterDeviceGuard } from '../guards/jwt-register-device.guard';

@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DevicesService,
    private readonly deviceGateway: DeviceGateway,
  ) {}

  @ApiOkResponse({ type: DeviceDto, isArray: true })
  @HttpCode(200)
  @Get('getMyDevices')
  @UseGuards(JwtAuthGuard)
  async getMyDevices(@Req() req: FastifyRequest & { user: { user: UserDto } }) {
    return await this.deviceService.getDevicesByUser(req.user.user.id).then((devices) => devices.map((device) => DeviceDto.fromEntity(device)));
  }

  @ApiBody({ type: NewDeviceDto })
  @ApiCreatedResponse({ type: String, description: 'Token de registro' })
  @ApiProduces('text/plain')
  @HttpCode(201)
  @Post('addNewDevice')
  @UseGuards(JwtAuthGuard)
  async addNewDevice(@Req() req: Request & { user: { user: UserDto } }, @Body() body: NewDeviceDto) {
    return await this.deviceService.addNewDevice(req.user.user.id, body.name);
  }

  @Get('registerDevice')
  @HttpCode(200)
  @UseGuards(JwtRegisterDeviceGuard)
  async registerDevice(@Req() req: Request & { user: { deviceId: string } }) {
    return await this.deviceService.registerDevice(req.user.deviceId);
  }

  @Get('refreshDevice')
  @HttpCode(200)
  @UseGuards(JwtRefreshDeviceGuard)
  async refreshDevice(@Req() req: Request & { user: { user: UserDto } }, @Query() query: { deviceId: string }) {
    return await this.deviceService.getNewToken(query.deviceId);
  }

  @Get('getListOfFiles')
  @ApiQuery({ name: 'deviceId', required: true })
  @ApiQuery({ name: 'path', required: false })
  @ApiOkResponse({ type: FileDto, isArray: true })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async getListOfFiles(@Req() req: Request & { user: { user: UserDto } }, @Query() query: { deviceId: string; path?: string }) {
    const deviceSocketId = await this.deviceService.getSocketIdByDeviceId(req.user.user.id, query.deviceId);
    if (!deviceSocketId) {
      throw new NotFoundException('El dispositivo no está en línea');
    }
    return await this.deviceGateway.getListOfFiles(deviceSocketId, query.path || '/');
  }
}
