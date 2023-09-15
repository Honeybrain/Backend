import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, GrpcAuthGuard],
})
export class UserModule {}
