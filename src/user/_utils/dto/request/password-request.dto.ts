import { IsString } from 'class-validator';

export class PasswordRequestDto {
  @IsString()
  token: string;
  @IsString()
  password: string;
}
