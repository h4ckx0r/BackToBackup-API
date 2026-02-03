import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from 'src/common-utils';
import { UserDto } from '../../database/models/dto/user.dto';
import { RolesService } from '../../database/roles/roles.service';
import { UsersService } from '../../database/users/users.service';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';
import { JwtRefreshAuthGuard } from '../guards/jwt-auth-refresh.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly secureCookie: boolean = process.env.NODE_ENV === 'production';
  private readonly sameSiteOption: 'strict' | 'lax' | 'none' = process.env.NODE_ENV === 'production' ? 'strict' : 'lax';
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    description: 'Datos del usuario y una cookie con el token JWT',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Inicio de sesión incorrecto',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Body() userDto: LoginUserDto, @Res() res: FastifyReply) {
    const { user, token, refreshToken } = await this.authService.loginUser(userDto);
    res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: this.secureCookie,
      sameSite: this.sameSiteOption,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.cookie('refresh_token', refreshToken.refresh_token, {
      httpOnly: true,
      secure: this.secureCookie,
      sameSite: this.sameSiteOption,
      path: '/',
      maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
    });

    res.send(user);
  }

  @ApiBody({
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'El usuario se ha creado',
    type: UserDto,
  })
  @ApiConflictResponse({
    description: 'El usuario ya existe',
  })
  @ApiBadRequestResponse({
    description: 'Faltan datos',
  })
  @HttpCode(201)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: FastifyReply) {
    try {
      const { user, token, refreshToken } = await this.authService.registerUser(createUserDto);
      res.cookie('token', token.access_token, {
        httpOnly: true,
        secure: this.secureCookie,
        sameSite: this.sameSiteOption,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000, // 1 día
      });

      res.cookie('refresh_token', refreshToken.refresh_token, {
        httpOnly: true,
        secure: this.secureCookie,
        sameSite: this.sameSiteOption,
        path: '/',
        maxAge: 40 * 24 * 60 * 60 * 1000, // 40 días
      });

      res.send(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Error al registrar el usuario');
      }
    }
  }

  @ApiCookieAuth('refresh_token')
  @ApiCookieAuth('token')
  @ApiOkResponse({
    description: 'Cookie con el token JWT nuevo',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token inválido',
  })
  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(200)
  @Post('refresh')
  refreshToken(@Request() req: FastifyRequest & { user: { user: UserDto } }, @Res() res: FastifyReply) {
    const token = this.authService.createJWT(req.user.user);
    res.cookie('token', token.access_token, {
      httpOnly: true,
      secure: this.secureCookie,
      sameSite: this.sameSiteOption,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });
    res.send();
  }

  /**
   * Endpoint de cierre de sesión
   */
  @ApiCookieAuth('token')
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    description: 'Se han eliminado las cookies',
  })
  @HttpCode(200)
  @Post('logout')
  logout(@Res() res: FastifyReply) {
    res.clearCookie('token');
    res.clearCookie('refresh_token');
    res.send();
  }

  /**
   * Endpoint de obtención de datos del usuario autenticado
   */
  @ApiCookieAuth('token')
  @ApiOkResponse({
    description: 'Datos del usuario autenticado',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Get('me')
  async getMe(@Request() req: FastifyRequest & { user: { user: UserDto } }) {
    const user = await this.usersService.findOne(req.user.user.id, true);
    if (!user) {
      throw new UnauthorizedException();
    }
    return UserDto.fromEntity(user, this.rolesService.calculateEffectivePermissions(user.roles));
  }
}
