import { IsEmail, IsString } from 'class-validator';

export class EmailRequestDto {
  @IsString()
  token: string;
  @IsEmail()
  email: string;
}
