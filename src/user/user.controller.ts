import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { EmailRequestDto } from './_utils/dto/request/email-request.dto';
import { PasswordRequestDto } from './_utils/dto/request/password-request.dto';
import { ChangeLanguageRequestDto } from './_utils/dto/request/change-language-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { InviteUserRequestDto } from './_utils/dto/request/invite-user-request.dto';
import { GetEmptyDto } from '../_utils/dto/response/get-empty.dto';
import { ActivateUserRequestDto } from './_utils/dto/request/activate-request.dto';
import { ChangeRightsRequestDto } from './_utils/dto/request/change-rights-request.dto';
import { GrpcAuthGuard } from './_utils/jwt/grpc-auth.guard';
import { MetadataWithUser } from './_utils/interface/metadata-with-user.interface';
import { GetUsersListDto } from './_utils/dto/response/get-users-list.dto';
import { ActivateResponseDto } from './_utils/dto/response/activate-response.dto';
import { Protect } from '../_utils/decorators/protect.decorator';
import { RoleEnum } from './_utils/enums/role.enum';
import { GetUserDto } from './_utils/dto/response/get-user.dto';
import { UserRequestDto } from './_utils/dto/request/user-request.dto';
import { UserLanguageResponseDto } from './_utils/dto/response/user-language-response.dto';
import { GetHistoryRequestDto } from './_utils/dto/request/get-history-request.dto';
import { GetHistoryResponseDto } from './_utils/dto/response/get-history-response.dto';
import { NightModeRequestDto } from './_utils/dto/request/change-night-mode-request.dto'

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

  @Protect()
  @GrpcMethod('User', 'GetMe')
  getMe(_: unknown, meta: MetadataWithUser) {
    return this.userService.getMe(meta.user);
  }

  @Protect()
  @GrpcMethod('User', 'ChangeEmail')
  changeEmail(data: EmailRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.changeEmail(data.email, meta.user);
  }

  @Protect()
  @GrpcMethod('User', 'ResetPassword')
  resetPassword(data: PasswordRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.resetPassword(data.password, meta.user);
  }

  @Protect(RoleEnum.CAN_INVITE)
  @GrpcMethod('User', 'InviteUser')
  inviteUser(data: InviteUserRequestDto): Promise<GetUserDto> {
    return this.userService.inviteUser(data.email, data.roles);
  }

  @GrpcMethod('User', 'ActivateUser')
  activateUser(data: ActivateUserRequestDto): Promise<ActivateResponseDto> {
    return this.userService.activateUser(data);
  }

  @Protect()
  @GrpcMethod('User', 'ChangeRights')
  changeRights(data: ChangeRightsRequestDto): Promise<GetUserDto> {
    return this.userService.changeRights(data);
  }

  @GrpcMethod('User', 'GetUsers')
  getUsers(): Promise<GetUsersListDto> {
    return this.userService.findAllUsers();
  }

  @Protect(RoleEnum.ADMIN)
  @GrpcMethod('User', 'DeleteUser')
  deleteUser(emailRequestDto: EmailRequestDto): Promise<GetEmptyDto> {
    return this.userService.deleteUser(emailRequestDto);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('User', 'ChangeLanguage')
  changeLanguage(data: ChangeLanguageRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.changeLanguage(data.language, meta.user);
  }
  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('User', 'getUserLanguage')
  getUserLanguage(data: UserRequestDto, meta: MetadataWithUser): Promise<UserLanguageResponseDto> {
    return this.userService.getUserLanguage(meta.user);
  }

  //history
  @GrpcMethod('User', 'GetHistory')
  async getHistory(dto: GetHistoryRequestDto): Promise<GetHistoryResponseDto> {
    return this.userService.getHistory(dto);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('User', 'NightMode')
  changeNightMode(data: NightModeRequestDto, meta: MetadataWithUser): Promise<GetEmptyDto> {
    return this.userService.changeNightMode(data.nightMode, meta.user);
  }
}
