import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './models/entity/device.entity';
import { RoleEntity } from './models/entity/role.entity';
import { UserEntity } from './models/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: Number.parseInt(configService.get('DB_PORT') || '5432'),
        username: configService.get('POSTGRES_USER') || 'postgres',
        password: configService.get('POSTGRES_PASSWORD') || 'postgres',
        database: configService.get('POSTGRES_DB') || 'postgres',
        entities: [UserEntity, RoleEntity, DeviceEntity],
        cache: true,
        synchronize: true, // FIXME: Configurar migraciones en vez del syncronize
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
