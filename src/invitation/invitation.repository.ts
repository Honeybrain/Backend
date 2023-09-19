import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Invitation, InvitationDocument } from './invitation.schema';
import { RpcException } from '@nestjs/microservices';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Injectable()
export class InvitationRepository {
  constructor(@InjectModel(Invitation.name) private model: Model<InvitationDocument>) {}

  createInvitation = (userId: Types.ObjectId, token: string) =>
    this.model.create({ user: userId, activationToken: token });

  findByToken = (token: string) =>
    this.model
      .findOne({ activationToken: token })
      .orFail(new RpcException({ code: Status.NOT_FOUND, message: 'INVITATION_NOT_FOUND' }))
      .exec();

  markUsed = async (token: string): Promise<InvitationDocument> => {
    const invitation = await this.findByToken(token);
    invitation.used = true;
    return invitation.save();
  };
}
