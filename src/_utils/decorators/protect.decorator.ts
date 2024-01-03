import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum } from '../../user/_utils/enums/role.enum';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { GrpcAuthGuard } from '../../user/_utils/jwt/grpc-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../../user/_utils/jwt/roles.guard';

export function Protect(...roles: RoleEnum[]) {
  return applyDecorators(
    ApiBearerAuth(),
    Roles(...roles),
    UseGuards(GrpcAuthGuard, RolesGuard),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
  );
}
