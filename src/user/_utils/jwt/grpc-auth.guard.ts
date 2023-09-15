import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from '../../user.repository';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class GrpcAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToRpc().getContext();

    const metadata = context.getArgByIndex(1);
    if (!metadata) throw new RpcException('UNAUTHORIZED');

    const token = metadata.get('Authorization')[0].split(' ')[1];
    if (!token) throw new RpcException('UNAUTHORIZED');

    const payload: JwtPayload = await this.jwtService.verifyAsync(token).catch(() => {
      throw new RpcException('JWT_EXPIRED');
    });

    request['user'] = await this.userRepository.findById(payload.id);

    return true;
  }
}
