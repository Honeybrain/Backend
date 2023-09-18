import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './invitation.schema';
import { InvitationRepository } from './invitation.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }])],
  providers: [InvitationRepository],
  exports: [InvitationRepository],
})
export class InvitationModule {}
