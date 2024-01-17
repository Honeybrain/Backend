import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HistoryDocument = Document & History;

@Schema()
export class History {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  actionType: string; // 'user' ou 'attack'

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | null; // Si applicable

  @Prop({ required: true })
  description: string;
}

export const HistorySchema = SchemaFactory.createForClass(History);
