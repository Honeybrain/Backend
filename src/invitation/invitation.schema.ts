import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Document & Invitation;

@Schema()
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  activationToken: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ default: false })
  used: boolean;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
