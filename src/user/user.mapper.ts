import { Injectable } from '@nestjs/common';
import { UserDocument } from './user.schema';
import { GetUsersListDto } from './_utils/dto/response/get-users-list.dto';
import { GetUserDto } from './_utils/dto/response/get-user.dto';

@Injectable()
export class UserMapper {
  toGetUser = (user: UserDocument): GetUserDto => ({
    id: user._id.toString(),
    email: user.email,
    roles: user.roles,
    activated: user.activated,
    lan: user.lan,
  });

  toGetUsers = (users: UserDocument[]): GetUsersListDto => ({ users: users.map((user) => this.toGetUser(user)) });
}
