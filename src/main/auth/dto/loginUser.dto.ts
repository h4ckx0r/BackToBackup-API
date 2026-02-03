import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ type: 'string', description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', description: 'Contraseña del usuario', example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
