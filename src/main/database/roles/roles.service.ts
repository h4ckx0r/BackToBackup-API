import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { NewRoleDto } from '../../admin/dto/newRole.dto';
import { EffectivePermissions, RoleDto } from '../models/dto/role.dto';
import { PermissionLevel, RoleEntity } from '../models/entity/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async getAllRoles(): Promise<RoleDto[]> {
    return (await this.roleRepository.find()).map((role) => RoleDto.fromEntity(role));
  }

  async findOne(id: string): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new Error('El rol no existe');
    }
    return RoleDto.fromEntity(role);
  }

  async create(role: NewRoleDto): Promise<RoleEntity> {
    return await this.roleRepository.save(role);
  }

  async update(id: string, role: RoleDto): Promise<UpdateResult> {
    const updatedRole = await this.roleRepository.update(id, role);
    return updatedRole;
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.roleRepository.delete(id);
  }

  calculateEfectivePermissions(roles: RoleEntity[] | RoleDto[]): EffectivePermissions {
    if (!roles || roles.length === 0) {
      return {};
    }

    // Usamos Sets para eliminar duplicados sobre la marcha
    const adminUsersSet = new Set<PermissionLevel>();
    const adminSystemSet = new Set<PermissionLevel>();
    const adminRolesSet = new Set<PermissionLevel>();

    for (const role of roles) {
      role.adminUsers.forEach((p) => adminUsersSet.add(p));
      role.adminSystem.forEach((p) => adminSystemSet.add(p));
      role.adminRoles.forEach((p) => adminRolesSet.add(p));
    }

    return {
      adminUsers: Array.from(adminUsersSet),
      adminSystem: Array.from(adminSystemSet),
      adminRoles: Array.from(adminRolesSet),
    };
  }
}
