import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invitation, InvitationDocument } from './invitation.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InvitationRepository {
  constructor(@InjectModel(Invitation.name) private model: Model<InvitationDocument>) {}

  createInvitation = (email: string, token: string) => {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Token is valid for 24 hours

    return this.model.create({
      email: email,
      token: token,
      used: false,
      expiresAt: expirationDate,
    });
  };

  findByToken = (token: string) =>
    this.model.findOne({ token: token }).orFail(new RpcException('INVITATION_NOT_FOUND')).exec();

  async markUsed(token: string): Promise<InvitationDocument> {
    const invitation = await this.findByToken(token);
    invitation.used = true;
    return invitation.save();
  }
}
