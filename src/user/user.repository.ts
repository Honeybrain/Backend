import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { hashSync } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  createIfNotExist = (email: string, password: string) =>
    this.model
      .findOneAndUpdate(
        { email: email },
        { password: hashSync(password, 10) },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();

  findByEmail = (email: string) =>
    this.model.findOne({ email: email }).orFail(new RpcException('USER_NOT_FOUND')).exec();

  findById = (userId: string) => this.model.findById(userId).orFail(new RpcException('USER_NOT_FOUND')).exec();

  createUser = (signInSignUpDto: SignInSignUpDto) =>
    this.model.create({
      email: signInSignUpDto.email,
      password: hashSync(signInSignUpDto.password, 10),
    });

  async changeEmail(userId: string, newEmail: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    user.email = newEmail;
    return user.save();
  }

  async resetPassword(userId: string, newPassword: string): Promise<UserDocument> {
    const user = await this.findById(userId);
    user.password = hashSync(newPassword, 10);
    return user.save();
  }
}
