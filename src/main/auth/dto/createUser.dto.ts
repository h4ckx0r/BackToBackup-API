import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'string', description: 'Nombre del usuario', example: 'John' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ type: 'string', description: 'Apellido del usuario', example: 'Doe' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ type: 'string', description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ type: 'string', description: 'Contraseña del usuario', example: 'password' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
