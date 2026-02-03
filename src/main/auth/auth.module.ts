import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RolesModule } from '../database/roles/roles.module';
import { UsersModule } from '../database/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategy/jwt-auth.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule, RolesModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
