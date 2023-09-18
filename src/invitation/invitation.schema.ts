import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as dayjs from 'dayjs';

export type InvitationDocument = Document & Invitation;

@Schema()
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  activationToken: string;

  @Prop({ default: () => dayjs().add(1, 'day').toDate() })
  expirationDate: Date;

  @Prop({ default: false })
  used: boolean;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
