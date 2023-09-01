import { UserResponseDto } from '../dto/response/user-response.dto';
import { EmptyResponseDto } from '../dto/response/empty-response.dto';
import { EmailRequestDto } from '../dto/request/email-request.dto';
import { SignInSignUpDto } from '../dto/request/sign-in-sign-up.dto';

export interface UserProtoService {
  SignIn(data: SignInSignUpDto): Promise<UserResponseDto>;
  SignUp(data: SignInSignUpDto): Promise<UserResponseDto>;
  SignOut(data: void): Promise<EmptyResponseDto>;
  ResetPassword(data: EmailRequestDto): Promise<UserResponseDto>;
  ChangeEmail(data: EmailRequestDto): Promise<UserResponseDto>;
}
