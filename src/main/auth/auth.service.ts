import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';
import { UserDto } from '../database/models/dto/user.dto';
import { RolesService } from '../database/roles/roles.service';
import { UsersService } from '../database/users/users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user?.password && compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  createJWT(userDto: UserDto) {
    return {
      access_token: this.jwtService.sign(
        { user: userDto },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
    };
  }

  createRefreshToken(userDto: UserDto) {
    return {
      refresh_token: this.jwtService.sign(
        { user: userDto },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    };
  }

  async registerUser(createUserDto: CreateUserDto) {
    const hashedPassword = await hash(createUserDto.password, 12);
    createUserDto.password = hashedPassword;
    const user = await this.usersService.createOne(createUserDto);

    const token = this.createJWT(user);
    const refreshToken = this.createRefreshToken(user);
    return { user, token, refreshToken };
  }

  async loginUser(userDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(userDto.email, true);
    if (!user) {
      throw new UnauthorizedException();
    }

    const loggedUserDto = UserDto.fromEntity(user, this.rolesService.calculateEffectivePermissions(user.roles));
    const token = this.createJWT(loggedUserDto);
    const refreshToken = this.createRefreshToken(loggedUserDto);
    return { user: loggedUserDto, token, refreshToken };
  }
}
