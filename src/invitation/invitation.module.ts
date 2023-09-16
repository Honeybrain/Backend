import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './invitation.schema';
import { InvitationRepository } from './invitation.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Invitation.name, schema: InvitationSchema }])],
  providers: [InvitationRepository],
  exports: [InvitationRepository], // Exportez-le pour que d'autres modules puissent l'utiliser
})
export class InvitationModule {}
