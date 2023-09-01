import { Injectable, OnModuleInit } from '@nestjs/common';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { UserRepository } from './user.repository';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from './_utils/dto/response/user-response.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../_utils/config/config';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UserRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  onModuleInit() {
    const adminEmail = this.configService.get('CREATE_ADMIN_EMAIL');
    const adminPass = this.configService.get('CREATE_ADMIN_PASSWORD');

    if (!adminEmail) return;

    return this.usersRepository.createIfNotExist(adminEmail, adminPass);
  }

  async signUp(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.createUser(signInSignUpDto).catch((err) => {
      throw new RpcException(err);
    });
    return { message: 'User created successfully', token: this.jwtService.sign({ id: user._id }) };
  }

  async signIn(signInSignUpDto: SignInSignUpDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findByEmail(signInSignUpDto.email);
    if (compareSync(user.password, signInSignUpDto.password)) throw new RpcException('WRONG_PASSWORD');
    return { message: 'User signed in successfully', token: this.jwtService.sign({ id: user._id }) };
  }
}
