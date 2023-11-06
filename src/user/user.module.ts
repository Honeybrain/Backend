import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';
import { InvitationModule } from 'src/invitation/invitation.module';
import { MailsModule } from '../mails/mails.module';
import { UserMapper } from './user.mapper';

@Module({
  imports: [InvitationModule, MailsModule],
  controllers: [UserController],
  providers: [UserService, GrpcAuthGuard, UserMapper],
})
export class UserModule {}
