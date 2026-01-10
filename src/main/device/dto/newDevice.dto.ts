import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewDeviceDto {
  @ApiProperty({ type: 'string', description: 'Nombre del dispositivo', example: 'Mi ordenador' })
  @IsString()
  name: string;
}
