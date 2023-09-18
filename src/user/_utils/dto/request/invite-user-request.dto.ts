import { IsBoolean, IsEmail } from 'class-validator';

export class InviteUserRequestDto {
  @IsEmail()
  email: string;

  @IsBoolean()
  admin: boolean;
}
