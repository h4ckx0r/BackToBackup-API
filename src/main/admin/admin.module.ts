import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from '../database/roles/roles.module';
import { UsersModule } from '../database/users/users.module';
import { AdminController } from './controllers/admin.controller';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    RolesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [],
  exports: [],
  controllers: [AdminController],
})
export class AdminModule {}
