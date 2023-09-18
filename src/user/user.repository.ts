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

  findAllUsers = () => this.model.find().lean().exec();

  createUser = (user: User) =>
    this.model.create({
      email: user.email,
      password: user.password && hashSync(user.password, 10),
      admin: user.admin,
      activated: user.activated,
    });

  updateEmailByUserId = (userId: Types.ObjectId, newEmail: string): Promise<UserDocument> =>
    this.model
      .findByIdAndUpdate(userId, { email: newEmail }, { new: true })
      .orFail(new RpcException('USER_NOT_FOUND'))
      .exec();

  updatePasswordByUserId = (userId: Types.ObjectId, newPassword: string): Promise<UserDocument> =>
    this.model
      .findByIdAndUpdate(userId, { password: hashSync(newPassword, 10) }, { new: true })
      .orFail(new RpcException('USER_NOT_FOUND'))
      .exec();

  activateUserById = (userId: Types.ObjectId): Promise<UserDocument> =>
    this.model
      .findByIdAndUpdate(userId, { activated: true }, { new: true })
      .orFail(new RpcException('USER_NOT_FOUND'))
      .exec();

  updateRightByUserEmail = (email: string, admin: boolean): Promise<UserDocument> =>
    this.model
      .findOneAndUpdate({ email }, { admin: admin }, { new: true })
      .orFail(new RpcException('USER_NOT_FOUND'))
      .exec();

  updateDeleteById = (userId: string) => 
  this.model
  .findByIdAndDelete(userId)
  .orFail(new RpcException('USER_NOT_FOUND'))
  .exec();
}
