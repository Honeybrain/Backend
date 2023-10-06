import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../../_utils/decorators/roles.decorator';
import { RoleEnum } from '../enums/role.enum';
import { User } from '../../user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!requiredRoles.length) return true;
    if (user.roles.includes(RoleEnum.ADMIN)) return true;

    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
