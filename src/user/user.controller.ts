import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { EmailRequestDto } from './_utils/dto/request/email-request.dto';
import { PasswordRequestDto } from './_utils/dto/request/password-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { InviteUserRequestDto } from './_utils/dto/request/invite-user-request.dto';
import { GetEmptyDto } from '../_utils/dto/response/get-empty.dto';
import { ActivateUserRequestDto } from './_utils/dto/request/activate-request.dto';
import { ChangeRightsRequestDto } from './_utils/dto/request/change-rights-request.dto';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';
import { MetadataWithUser } from './_utils/interface/metadata-with-user.interface';
import { GetUsersListDto } from './_utils/dto/response/get-users-list.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('User', 'SignUp')
  signUp(signInSignUpDto: SignInSignUpDto) {
    return this.userService.signUp(signInSignUpDto);
  }

  @GrpcMethod('User', 'SignIn')
  signIn(signInSignUpDto: SignInSignUpDto) {
    return this.userService.signIn(signInSignUpDto);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('User', 'ChangeEmail')
  changeEmail(data: EmailRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.changeEmail(data.email, meta.user);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('User', 'ResetPassword')
  resetPassword(data: PasswordRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.resetPassword(data.password, meta.user);
  }

  @GrpcMethod('User', 'InviteUser')
  inviteUser(data: InviteUserRequestDto): Promise<GetEmptyDto> {
    return this.userService.inviteUser(data.email, data.admin);
  }

  @GrpcMethod('User', 'ActivateUser')
  activateUser(data: ActivateUserRequestDto): Promise<GetEmptyDto> {
    return this.userService.activateUser(data.token);
  }

  @GrpcMethod('User', 'ChangeRights')
  changeRights(data: ChangeRightsRequestDto): Promise<GetEmptyDto> {
    return this.userService.changeRights(data);
  }

  @GrpcMethod('User', 'GetUsers')
  getUsers(): Promise<GetUsersListDto> {
    return this.userService.findAllUsers();
  }

  @GrpcMethod('User', 'DeleteUser')
  deleteUser(email: string): Promise<GetEmptyDto> {
    return this.userService.deleteUser(email);
  }
}
