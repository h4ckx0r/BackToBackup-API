import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateUserWithRolesDto } from 'src/main/admin/dto/createUserWithRoles.dto';
import { UserPageResponseDto } from 'src/main/admin/dto/userPageResponse.dto';
import { PageDto } from 'src/main/database/models/dto/page.dto';
import { PageOptionsDto } from 'src/main/database/models/dto/pageOptions.dto';
import { RoleDto } from 'src/main/database/models/dto/role.dto';
import { UserDto } from 'src/main/database/models/dto/user.dto';
import { PermissionLevel } from 'src/main/database/models/entity/role.entity';
import { RolesService } from 'src/main/database/roles/roles.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UsersService } from '../../database/users/users.service';
import { AdminPermsGuard, CheckRolePermission } from '../admin-perms.guard';
import { NewRoleDto } from '../dto/newRole.dto';

@Controller('admin')
@UseGuards(AdminPermsGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @ApiOkResponse({
    type: UserPageResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para ver los usuarios',
  })
  @Get('users')
  @CheckRolePermission('adminUsers', PermissionLevel.READ, 'No tienes permiso para ver los usuarios')
  async getAllUsers(@Query() query: PageOptionsDto) {
    const users: PageDto<UserDto> = await this.usersService.getUsers(query);
    return users;
  }

  @ApiOkResponse({
    description: 'Usuario eliminado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para eliminar un usuario',
  })
  @Delete('users/:id')
  @CheckRolePermission('adminUsers', PermissionLevel.DELETE, 'No tienes permiso para eliminar un usuario')
  async deleteUser(@Param('id') id: string) {
    const deleteResponse = await this.usersService.deleteOne(id);
    return deleteResponse.affected === 1;
  }

  @ApiCreatedResponse({
    description: 'Usuario creado',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para crear un usuario',
  })
  @Post('users')
  @HttpCode(201)
  @CheckRolePermission('adminUsers', PermissionLevel.WRITE, 'No tienes permiso para crear un usuario')
  async createUser(@Body() userDto: CreateUserWithRolesDto) {
    const user: UserDto = await this.usersService.createOne(userDto);
    return user;
  }

  @ApiOkResponse({
    description: 'Usuario modificado',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para modificar un usuario',
  })
  @Put('users/:id')
  @CheckRolePermission('adminUsers', PermissionLevel.WRITE, 'No tienes permiso para modificar un usuario')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    const user: UserDto = await this.usersService.updateOne(id, userDto);
    return user;
  }

  @ApiOkResponse({
    type: RoleDto,
    isArray: true,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para ver los roles',
  })
  @Get('roles')
  @CheckRolePermission('adminRoles', PermissionLevel.READ, 'No tienes permiso para ver los roles')
  async getAllRoles() {
    const roles: RoleDto[] = await this.rolesService.getAllRoles();
    return roles;
  }

  @ApiCreatedResponse({
    description: 'Rol creado',
    type: RoleDto,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para crear un rol',
  })
  @Post('roles')
  @HttpCode(201)
  @CheckRolePermission('adminRoles', PermissionLevel.WRITE, 'No tienes permiso para crear un rol')
  async createRole(@Body() roleDto: NewRoleDto) {
    const role: RoleDto = await this.rolesService.create(roleDto);
    return role;
  }

  @ApiOkResponse({
    description: 'Rol modificado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para modificar un rol',
  })
  @Put('roles/:id')
  @CheckRolePermission('adminRoles', PermissionLevel.WRITE, 'No tienes permiso para modificar un rol')
  async updateRole(@Param('id') id: string, @Body() roleDto: RoleDto) {
    const updateResponse: UpdateResult = await this.rolesService.update(id, roleDto);
    return updateResponse.affected === 1;
  }

  @ApiOkResponse({
    description: 'Rol eliminado',
    type: Boolean,
  })
  @ApiForbiddenResponse({
    description: 'No tienes permiso para eliminar un rol',
  })
  @Delete('roles/:id')
  @CheckRolePermission('adminRoles', PermissionLevel.DELETE, 'No tienes permiso para eliminar un rol')
  async deleteRole(@Param('id') id: string) {
    const deleteResponse: DeleteResult = await this.rolesService.delete(id);
    return deleteResponse.affected === 1;
  }
}
