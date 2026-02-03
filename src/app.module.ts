import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './main/admin/admin.module';
import { AuthModule } from './main/auth/auth.module';
import { DatabaseModule } from './main/database/database.module';
import { UsersModule } from './main/database/users/users.module';
import { DeviceModule } from './main/device/device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    DeviceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
