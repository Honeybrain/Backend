import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop({ default: null, type: String })
  password: string | null;

  @Prop({ required: true })
  admin: boolean;

  @Prop({ required: true })
  activated: boolean;

  @Prop({required: true, default: "en"})
  lan: string | "en";
}

export const UserSchema = SchemaFactory.createForClass(User);
