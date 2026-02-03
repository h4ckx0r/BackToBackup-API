import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { UserDto } from '../database/models/dto/user.dto';
import { PermissionLevel, Permissions } from '../database/models/entity/role.entity';

export type ScopePermissionConfig = { scope: keyof Permissions; allowedRoles: PermissionLevel; customErrorMsg?: string };
export const CheckRolePermission = (scope: keyof Permissions, allowedRoles: PermissionLevel, customErrorMsg?: string) =>
  SetMetadata('role-permission', { scope, allowedRoles, customErrorMsg } as ScopePermissionConfig);

@Injectable()
export class AdminPermsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const scopePermissions = this.reflector.getAllAndOverride<ScopePermissionConfig>('role-permission', [context.getHandler(), context.getClass()]);

    if (!scopePermissions) return true;

    const req: FastifyRequest = context.switchToHttp().getRequest();
    const jwtPayload: { user: UserDto } = this.jwtService.decode(req.cookies?.token as string);

    if (!jwtPayload.user?.effectivePermissions?.[scopePermissions.scope]?.includes(scopePermissions.allowedRoles)) {
      throw new ForbiddenException(scopePermissions.customErrorMsg || `No tienes permiso para realizar esta acción en el ámbito ${scopePermissions.scope}`);
    }

    return true;
  }
}
