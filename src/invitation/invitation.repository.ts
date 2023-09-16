import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invitation, InvitationDocument } from './invitation.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InvitationRepository {
  constructor(@InjectModel(Invitation.name) private model: Model<InvitationDocument>) {}

  createInvitation = (userId: Types.ObjectId, token: string) => {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Token is valid for 24 hours

    return this.model.create({
      user: userId,
      activationToken: token,
      used: false,
      expirationDate: expirationDate,
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
