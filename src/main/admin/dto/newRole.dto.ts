import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { PermissionLevel } from '../../database/models/entity/role.entity';

export class NewRoleDto {
  @ApiProperty({ type: 'string', description: 'Nombre del rol', example: 'Administrador' })
  @IsString()
  name: string;

  @ApiProperty({ type: 'array', items: { type: 'string' }, description: 'Permisos del rol', example: ['read', 'write', 'delete'] })
  @IsArray()
  adminUsers: PermissionLevel[];

  @ApiProperty({ type: 'array', items: { type: 'string' }, description: 'Permisos del rol', example: ['read', 'write', 'delete'] })
  @IsArray()
  adminSystem: PermissionLevel[];

  @ApiProperty({ type: 'array', items: { type: 'string' }, description: 'Permisos del rol', example: ['read', 'write', 'delete'] })
  @IsArray()
  adminRoles: PermissionLevel[];
}
