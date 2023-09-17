import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { hashSync } from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  createIfNotExist = (email: string, password: string) =>
    this.model
      .findOneAndUpdate(
        { email: email },
        {
          $set: {
            password: hashSync(password, 10),
            admin: true,
            activated: true,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();

  findByEmail = (email: string) =>
    this.model.findOne({ email: email }).orFail(new RpcException('USER_NOT_FOUND')).exec();

  findById = (userId: string) => this.model.findById(userId).orFail(new RpcException('USER_NOT_FOUND')).exec();

  findAllUsers = () => this.model.find().exec();

  createUser = (user: User) =>
    this.model.create({
      email: user.email,
      password: hashSync(user.password, 10),
      admin: user.admin,
      activated: user.activated,
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

  async markActivated(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.findById(userId.toString());
    if (user.activated) {
      throw new RpcException('USER_ALREADY_ACTIVATED');
    }
    user.activated = true;
    return user.save();
  }
}
