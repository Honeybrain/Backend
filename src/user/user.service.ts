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
import { UserLanguageResponseDto } from './_utils/dto/response/user-language-response.dto';
import { UserNightModeResponseDto } from './_utils/dto/response/user-nightmode-response.dto';
import { Status } from '@grpc/grpc-js/build/src/constants';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly mailsService: MailsService,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UserRepository,
    private readonly invitationsRepository: InvitationRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
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
      admin: true,
      activated: true,
      lan: "en",
      nightMode: false,
    };
    const user = await this.usersRepository.createUser(userModel).catch((err) => {
      throw new RpcException({ code: Status.CANCELLED, message: err });
    });
    return { message: 'User created successfully', token: this.jwtService.sign({ id: user._id }) };
  }

  async signIn(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(signInSignUpDto.email);
    if (user.password && !compareSync(signInSignUpDto.password, user.password))
      throw new RpcException({ code: status.UNAUTHENTICATED, message: 'Wrong password' });
    return { message: 'User signed in successfully', token: this.jwtService.sign({ id: user._id }) };
  }

  changeEmail = (newEmail: string, user: UserDocument): Promise<GetEmptyDto> =>
    this.usersRepository
      .updateEmailByUserId(user._id, newEmail)
      .then(() => ({ message: 'E-mail modifié avec succès' }));

  resetPassword = (newPassword: string, user: UserDocument): Promise<GetEmptyDto> =>
    this.usersRepository
      .updatePasswordByUserId(user._id, newPassword)
      .then(() => ({ message: 'Mot de passe modifié avec succès' }));

  async inviteUser(email: string, admin: boolean) {
    const activationToken = uuidv4();

    const userModel: User = {
      email: email,
      password: null,
      admin: admin,
      activated: false,
      lan: "en",
      nightMode: false,
    };

    try {
      const user = await this.usersRepository.createUser(userModel);

      await this.invitationsRepository.createInvitation(user._id, activationToken);

      const activationLink = `http://localhost:3000/activate/${activationToken}`;
      await this.mailsService.sendActivationMail(email, activationLink);

      return { message: 'User invited successfully. Activation email sent.' };
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
    console.log(token);
    return { token: token.token };
  }

  async changeRights(changeRightsRequestDto: ChangeRightsRequestDto) {
    await this.usersRepository.updateRightByUserEmail(changeRightsRequestDto.email, changeRightsRequestDto.admin);

    return { message: 'User rights changed successfully' };
  }

  async findAllUsers(): Promise<GetUsersListDto> {
    const users = await this.usersRepository.findAllUsers();

    const mappedUsers = users.map((user) =>
      JSON.stringify({ id: user._id, email: user.email, admin: user.admin, activated: user.activated, lan: user.lan, nightMode: user.nightMode }),
    );

    return { users: mappedUsers };
  }

  deleteUser = (emailRequestDto: EmailRequestDto) =>
    this.usersRepository.updateDeleteByUserEmail(emailRequestDto.email).then(() => ({
      message: 'User deleted successfully',
    }));

  changeLanguage = (newLanguage: string , user: UserDocument): Promise<GetEmptyDto> =>
  this.usersRepository
    .updateLanguageByUserId(user._id, newLanguage)
    .then(() => ({ message: 'langue modifié avec succès !' }));

  async getUserLanguage(user: UserDocument): Promise<UserLanguageResponseDto> {
    return { lan: user.lan };
  }

  async getUserNightMode(user: UserDocument): Promise<UserNightModeResponseDto> {
    return {nightMode: user.nightMode}
  }
}
