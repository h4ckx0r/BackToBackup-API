import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'src/common-utils';
import { CreateUserWithRolesDto } from 'src/main/admin/dto/createUserWithRoles.dto';
import { UserWithRolesDto } from 'src/main/admin/dto/userWithRoles.dto';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from '../../auth/dto/createUser.dto';
import { PageDto } from '../models/dto/page.dto';
import { ORDER_OPTIONS, PageOptionsDto } from '../models/dto/pageOptions.dto';
import { UserDto } from '../models/dto/user.dto';
import { PermissionLevel, RoleEntity } from '../models/entity/role.entity';
import { UserEntity } from '../models/entity/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async findOneByEmail(email: string, ignoreCache: boolean = false): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email }, relations: { roles: true }, cache: !ignoreCache });
    if (!user) {
      return null;
    }
    return user;
  }

  async findUserEmail(id: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { id }, cache: true, select: ['email'] });
    if (!user) {
      return null;
    }
    return user.email;
  }

  async findOne(id: string, ignoreCache: boolean = false): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id }, relations: { roles: true }, cache: !ignoreCache });
    if (!user) {
      return null;
    }
    return user;
  }

  async createOne(createUserDto: CreateUserDto | CreateUserWithRolesDto): Promise<UserDto> {
    const userExists = await this.findOneByEmail(createUserDto.email, true);
    if (userExists) {
      throw new ValidationError('El usuario ya existe');
    }

    const userEntity = new UserEntity();
    Object.assign(userEntity, createUserDto);

    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const role = new RoleEntity();
      role.name = 'Administrador';
      role.adminUsers = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
      role.adminSystem = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
      role.adminRoles = [PermissionLevel.READ, PermissionLevel.WRITE, PermissionLevel.DELETE];
      const roleSaved = await this.rolesService.create(role); //TODO: Revisar si es necesario o con el save de después sirve
      userEntity.roles = [roleSaved];
    }
    const userSaved = await this.userRepository.save(userEntity);
    return UserDto.fromEntity(userSaved, this.rolesService.calculateEffectivePermissions(userSaved.roles));
  }

  async deleteOne(id: string): Promise<DeleteResult> {
    const user = await this.findOne(id);
    if (!user) {
      throw new ValidationError('El usuario no existe');
    }
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  }

  async updateOne(id: string, userDto: UserDto): Promise<UserDto> {
    const user = await this.findOne(id);
    if (!user) {
      throw new ValidationError('El usuario no existe');
    }
    Object.assign(user, userDto);

    const userSaved = await this.userRepository.save(user);
    return UserDto.fromEntity(userSaved, this.rolesService.calculateEffectivePermissions(userSaved.roles));
  }

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserWithRolesDto>> {
    const { pageNumber = 1, pageSize = 10, order = ORDER_OPTIONS.ASC } = pageOptionsDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.take(pageSize);
    queryBuilder.skip((pageNumber - 1) * pageSize);
    queryBuilder.orderBy('user.firstName', order);
    queryBuilder.leftJoinAndSelect('user.roles', 'roles');

    const [users, count] = await queryBuilder.getManyAndCount();

    // Convertir a DTO y eliminar contraseñas usando desestructuración
    const userDtos: UserWithRolesDto[] = users.map((user: UserEntity) => {
      const userDto = UserDto.fromEntity(user, this.rolesService.calculateEffectivePermissions(user.roles));
      const userWithRolesDto = new UserWithRolesDto(userDto);
      userWithRolesDto.roles = user.roles;
      return userWithRolesDto;
    });

    const page = new PageDto(userDtos, pageNumber, pageSize, count, Math.ceil(count / pageSize));
    return page;
  }
}
