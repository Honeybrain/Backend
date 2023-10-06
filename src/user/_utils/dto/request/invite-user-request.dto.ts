import { IsEmail, IsEnum } from 'class-validator';
import { RoleEnum } from '../../enums/role.enum';

export class InviteUserRequestDto {
  @IsEmail()
  email: string;

  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
