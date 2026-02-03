import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { UserEntity } from '../entity/user.entity';
import { EffectivePermissions } from './role.dto';

export class UserDto {
  @IsUUID()
  @ApiProperty({ type: 'string', description: 'ID del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @IsString()
  @ApiProperty({ type: 'string', description: 'Nombre del usuario', example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ type: 'string', description: 'Apellido del usuario', example: 'Doe' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ type: 'string', description: 'Email del usuario', example: 'user@example.com' })
  email: string;

  @ApiProperty({
    type: 'object',
    description: 'Permisos efectivos del usuario',
    properties: {
      adminUsers: { type: 'array', items: { type: 'string' } },
      adminSystem: { type: 'array', items: { type: 'string' } },
      adminRoles: { type: 'array', items: { type: 'string' } },
    },
    example: {
      adminUsers: ['read', 'write', 'delete'],
      adminSystem: ['read', 'write', 'delete'],
      adminRoles: ['read', 'write', 'delete'],
    },
    additionalProperties: false,
  })
  effectivePermissions: EffectivePermissions;

  static fromEntity(entity: UserEntity, effectivePermissions: EffectivePermissions): UserDto {
    const userDto = plainToClass(UserDto, entity, { excludePrefixes: ['roles', 'devices', 'password'] });
    userDto.effectivePermissions = effectivePermissions;
    return userDto;
  }

  static toEntity(dto: UserDto): UserEntity {
    return plainToClass(UserEntity, dto, { excludePrefixes: ['roles', 'devices'] });
  }

  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
