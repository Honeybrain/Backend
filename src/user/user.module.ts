import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';
import { InvitationModule } from 'src/invitation/invitation.module';
import { MailsModule } from '../mails/mails.module';
import { UserMapper } from './user.mapper';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [InvitationModule, MailsModule, HistoryModule],
  controllers: [UserController],
  providers: [UserService, GrpcAuthGuard, UserMapper],
})
export class UserModule {}
