import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from './_utils/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop({ default: null, type: String })
  password: string | null;

  @Prop({ default: [], type: [{ type: Number, enum: RoleEnum }] })
  roles: RoleEnum[];

  @Prop({ required: true })
  activated: boolean;

  @Prop({ required: true, default: 'en' })
  lan: string | 'en';

  @Prop({ default: false })
  nightMode: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
