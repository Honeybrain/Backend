import { Injectable, OnModuleInit } from '@nestjs/common';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { UserResponseDto } from './_utils/dto/response/user-response.dto';
import { UserRepository } from './user.repository';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/config';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './user.schema';
import { status } from '@grpc/grpc-js';
import { InvitationRepository } from 'src/invitation/invitation.repository';
import { ChangeRightsRequestDto } from './_utils/dto/request/change-rights-request.dto';
import { GetEmptyDto } from '../_utils/dto/response/get-empty.dto';
import { GetUsersListDto } from './_utils/dto/response/get-users-list.dto';
import { MailsService } from '../mails/mails.service';
import { EmailRequestDto } from './_utils/dto/request/email-request.dto';
import { ActivateUserRequestDto } from './_utils/dto/request/activate-request.dto';
import { ActivateResponseDto } from './_utils/dto/response/activate-response.dto';
import { Status } from '@grpc/grpc-js/build/src/constants';
import { RoleEnum } from './_utils/enums/role.enum';
import { UserMapper } from './user.mapper';
import { GetUserDto } from './_utils/dto/response/get-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly mailsService: MailsService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UserRepository,
    private readonly invitationsRepository: InvitationRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly userMapper: UserMapper,
  ) {}

  onModuleInit() {
    const adminEmail = this.configService.get('CREATE_ADMIN_EMAIL');
    const adminPass = this.configService.get('CREATE_ADMIN_PASSWORD');

    if (!adminEmail) return;

    return this.usersRepository.createIfNotExist(adminEmail, adminPass);
  }

  async signUp(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const userModel: User = {
      email: signInSignUpDto.email,
      password: signInSignUpDto.password,
      roles: [RoleEnum.ADMIN],
      activated: true,
      lan: 'en',
    };
    const user = await this.usersRepository.createUser(userModel).catch((err) => {
      throw new RpcException({ code: Status.CANCELLED, message: err });
    });
    return {
      message: 'User created successfully',
      token: this.jwtService.sign({ id: user._id }),
      user: this.userMapper.toGetUser(user),
    };
  }

  getMe = (user: UserDocument): GetUserDto => this.userMapper.toGetUser(user);

  async signIn(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(signInSignUpDto.email);
    if (user.password && !compareSync(signInSignUpDto.password, user.password))
      throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Wrong password' });
    return {
      message: 'User signed in successfully',
      token: this.jwtService.sign({ id: user._id }),
      user: this.userMapper.toGetUser(user),
    };
  }

  changeEmail = (newEmail: string, user: UserDocument): Promise<GetEmptyDto> =>
    this.usersRepository
      .updateEmailByUserId(user._id, newEmail)
      .then(() => ({ message: 'E-mail modifié avec succès' }));

  resetPassword = (newPassword: string, user: UserDocument): Promise<GetEmptyDto> =>
    this.usersRepository
      .updatePasswordByUserId(user._id, newPassword)
      .then(() => ({ message: 'Mot de passe modifié avec succès' }));

  async inviteUser(email: string, roles: RoleEnum[]) {
    const activationToken = uuidv4();

    const userModel: User = {
      email: email,
      password: null,
      roles: roles,
      activated: false,
      lan: 'en',
    };

    try {
      const user = await this.usersRepository.createUser(userModel);

      await this.invitationsRepository.createInvitation(user._id, activationToken);

      const activationLink = `http://localhost:3000/activate/${activationToken}`;
      await this.mailsService.sendActivationMail(email, activationLink);

      return this.userMapper.toGetUser(user);
    } catch (error) {
      if (error.code === 11000 && error.message.includes('email')) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'An account with this email already exists.',
        });
      }
      throw new RpcException({ code: status.INTERNAL, message: `An error occured while inviting user: ${error}` });
    }
  }

  async activateUser(data: ActivateUserRequestDto): Promise<ActivateResponseDto> {
    const activationToken = data.token;
    const password = data.password;
    const invitation = await this.invitationsRepository.findByToken(activationToken);

    if (invitation.used) throw new RpcException({ code: status.ALREADY_EXISTS, message: 'Invitation already used' });

    const currentDate = new Date();
    if (invitation.expirationDate <= currentDate)
      throw new RpcException({ code: status.DEADLINE_EXCEEDED, message: 'Invitation has expired' });

    await this.usersRepository.updatePasswordByUserId(invitation.user._id, password);
    await this.usersRepository.activateUserById(invitation.user._id);
    await this.invitationsRepository.markUsed(activationToken);
    const user = await this.usersRepository.findById(invitation.user._id.toString());
    const token = await this.signIn({ email: user.email, password: password });
    return { token: token.token };
  }

  changeRights = (changeRightsRequestDto: ChangeRightsRequestDto) =>
    this.usersRepository
      .updateRightByUserEmail(changeRightsRequestDto.email, changeRightsRequestDto.roles)
      .then((x) => this.userMapper.toGetUser(x));

  findAllUsers = (): Promise<GetUsersListDto> =>
    this.usersRepository.findAllUsers().then((x) => this.userMapper.toGetUsers(x));

  deleteUser = (emailRequestDto: EmailRequestDto) =>
    this.usersRepository.updateDeleteByUserEmail(emailRequestDto.email).then(() => ({
      message: 'User deleted successfully',
    }));

  changeLanguage = (newLanguage: string, user: UserDocument): Promise<GetEmptyDto> =>
    this.usersRepository
      .updateLanguageByUserId(user._id, newLanguage)
      .then(() => ({ message: 'langue modifié avec succès !' }));
}
