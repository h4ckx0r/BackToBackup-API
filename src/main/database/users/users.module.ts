import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../models/entity/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
