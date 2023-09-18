import { IsString } from 'class-validator';

export class ActivateUserRequestDto {
  @IsString()
  token: string;
  @IsString()
  password: string;
}
