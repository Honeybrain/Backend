import { Module } from '@nestjs/common';
import { InvitationModule } from 'src/invitation/invitation.module';
import { MailsModule } from '../mails/mails.module';
import { MobileService } from './mobile.service';
import { MobileController } from './mobile.controller';

@Module({
  imports: [InvitationModule, MailsModule],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
