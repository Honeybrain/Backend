import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { EmailRequestDto } from './_utils/dto/request/email-request.dto';
import { PasswordRequestDto } from './_utils/dto/request/password-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './_utils/dto/response/user-response.dto';
import { InviteUserRequestDto } from './_utils/dto/request/invite-user-request.dto';
import { EmptyResponseDto } from './_utils/dto/response/empty-response.dto';
import { ActivateUserRequestDto } from './_utils/dto/request/activate-request-dto';

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

  @GrpcMethod('User', 'ChangeEmail')
  async changeEmail(data: EmailRequestDto): Promise<UserResponseDto> {
    await this.userService.changeEmail(data.token, data.email);
    return { message: 'E-mail modifié avec succès', token: 'null' };
  }

  @GrpcMethod('User', 'ResetPassword')
  async resetPassword(data: PasswordRequestDto): Promise<UserResponseDto> {
    await this.userService.resetPassword(data.token, data.password);
    return { message: 'Mot de passe réinitialisé avec succès', token: 'null' };
  }

  @GrpcMethod('User', 'InviteUser')
  async inviteUser(data: InviteUserRequestDto): Promise<EmptyResponseDto> {
    return await this.userService.inviteUser(data.email, data.admin);
  }

  @GrpcMethod('User', 'ActivateUser')
  async activateUser(data: ActivateUserRequestDto): Promise<EmptyResponseDto> {
    return await this.userService.activateUser(data.token);
  }
}
