import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsArray, IsString, IsUUID } from 'class-validator';
import { PermissionLevel, Permissions, RoleEntity } from '../entity/role.entity';

export class RoleDto implements Permissions {
  @ApiProperty({ type: 'string', description: 'ID del rol', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;

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

  static fromEntity(entity: RoleEntity): RoleDto {
    return plainToClass(RoleDto, entity);
  }

  static toEntity(dto: RoleDto): RoleEntity {
    dto.adminUsers = dto.adminUsers || [];
    dto.adminSystem = dto.adminSystem || [];
    dto.adminRoles = dto.adminRoles || [];
    return plainToClass(RoleEntity, dto);
  }
}

export type EffectivePermissions = {
  adminUsers?: PermissionLevel[];
  adminSystem?: PermissionLevel[];
  adminRoles?: PermissionLevel[];
};
