import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [InvitationModule],
  controllers: [UserController],
  providers: [UserService, GrpcAuthGuard],
})
export class UserModule {}
