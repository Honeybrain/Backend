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
import { MailService } from '../mail/mail.service';
import { InvitationRepository } from 'src/invitation/invitation.repository';

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

    const user = await this.usersRepository.createUser(userModel).catch((err) => {
      throw new RpcException(err);
    });

    await this.invitationsRepository.createInvitation(user._id, activationToken).catch((err) => {
      throw new RpcException(err);
    });

    const activationLink = `http://localhost:3000/activate/${activationToken}`;
    const mailService = new MailService();
    mailService.sendActivationMail(email, activationLink);

    return { message: 'User invited successfully. Activation email sent.' };
  }
}
