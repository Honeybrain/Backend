import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import { SignInSignUpDto } from './_utils/dto/request/sign-in-sign-up.dto';
import { ApiTags } from '@nestjs/swagger';

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
}
