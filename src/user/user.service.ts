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
import { User } from './user.schema';
import { status } from '@grpc/grpc-js';
import { InvitationRepository } from 'src/invitation/invitation.repository';
import { GetUsersDto } from './_utils/dto/response/get-users-response.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
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
    };
    const user = await this.usersRepository.createUser(userModel).catch((err) => {
      throw new RpcException(err);
    });
    return { message: 'User created successfully', token: this.jwtService.sign({ id: user._id }) };
  }

  async signIn(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(signInSignUpDto.email);
    if (!compareSync(signInSignUpDto.password, user.password)) throw new RpcException('WRONG_PASSWORD');
    return { message: 'User signed in successfully', token: this.jwtService.sign({ id: user._id }) };
  }

  async changeEmail(token: string, newEmail: string): Promise<UserResponseDto> {
    const decodedToken = this.jwtService.decode(token) as any;
    const userId = decodedToken.id;
    await this.usersRepository.changeEmail(userId, newEmail);
    return { message: 'E-mail modifié avec succès', token: token };
  }

  async resetPassword(token: string, newPassword: string): Promise<UserResponseDto> {
    const decodedToken = this.jwtService.decode(token) as any;
    const userId = decodedToken.id;
    await this.usersRepository.resetPassword(userId, newPassword);
    return { message: 'Mot de passe réinitialisé avec succès', token: token };
  }

  async inviteUser(email: string, admin: boolean) {
    const activationToken = uuidv4();

    const userModel: User = {
      email: email,
      password: '',
      admin: admin,
      activated: false,
    };

    try {
      const user = await this.usersRepository.createUser(userModel);

      await this.invitationsRepository.createInvitation(user._id, activationToken);

      // const activationLink = `http://localhost:3000/activate/${activationToken}`;
      // const mailService = new MailService();
      // mailService.sendActivationMail(email, activationLink);

      return { message: 'User invited successfully. Activation email sent.' };
    } catch (error) {
      if (error.code === 11000 && error.message.includes('email')) {
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: 'An account with this email already exists.',
        });
      }
      throw new RpcException(error);
    }
  }

  async activateUser(activationToken: string) {
    const invitation = await this.invitationsRepository.findByToken(activationToken);
    if (!invitation) {
      throw new Error('Invalid activation token');
    }

    const currentDate = new Date();
    if (invitation.expirationDate <= currentDate) {
      throw new Error('Activation token has expired');
    }

    await this.usersRepository.markActivated(invitation.user._id);
    await this.invitationsRepository.markUsed(activationToken);

    return { message: 'User activated successfully' };
  }

  async findAllUsers(): Promise<GetUsersDto> {
    const rawUsers = await this.usersRepository.findAllUsers();

    const users = rawUsers.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, __v, ...rest } = user.toObject();
      return JSON.stringify(rest);
    });

    return { users };
  }
}
