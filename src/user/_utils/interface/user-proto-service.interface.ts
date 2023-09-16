import { UserResponseDto } from '../dto/response/user-response.dto';
import { EmailRequestDto } from '../dto/request/email-request.dto';
import { SignInSignUpDto } from '../dto/request/sign-in-sign-up.dto';
import { InviteUserRequestDto } from '../dto/request/invite-user-request.dto';
import { EmptyResponseDto } from '../dto/response/empty-response.dto';

export interface UserProtoService {
  SignIn(data: SignInSignUpDto): Promise<UserResponseDto>;
  SignUp(data: SignInSignUpDto): Promise<UserResponseDto>;
  ResetPassword(data: EmailRequestDto): Promise<UserResponseDto>;
  ChangeEmail(data: EmailRequestDto): Promise<UserResponseDto>;
  InviteUser(data: InviteUserRequestDto): Promise<EmptyResponseDto>;
}
