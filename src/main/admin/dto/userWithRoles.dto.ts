import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { RoleDto } from '../../database/models/dto/role.dto';
import { UserDto } from '../../database/models/dto/user.dto';

export class UserWithRolesDto extends UserDto {
  @ApiProperty({ type: RoleDto, isArray: true })
  @IsArray()
  roles: RoleDto[];

  constructor(partial?: Partial<UserWithRolesDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
