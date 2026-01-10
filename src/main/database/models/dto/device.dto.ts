import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { DeviceEntity } from '../entity/device.entity';

export class DeviceDto {
  @ApiProperty({ type: 'string', description: 'ID del dispositivo', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;

  @ApiProperty({ type: 'string', description: 'Nombre del dispositivo', example: 'Mi ordenador' })
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', description: 'Hostname del dispositivo', example: 'mi-ordenador' })
  @IsString()
  hostname?: string;

  @ApiProperty({ type: 'string', description: 'Sistema operativo del dispositivo', example: 'Windows 10' })
  @IsString()
  os?: string;

  @ApiProperty({ type: 'boolean', description: '¿Está el dispositivo en línea?', example: true })
  online?: boolean;

  static fromEntity(entity: DeviceEntity): DeviceDto {
    const dto = plainToClass(DeviceDto, entity, { excludePrefixes: ['refresh_token', 'socketId', 'deviceHash'] });
    dto.online = !!entity.socketId;
    return dto;
  }
}
