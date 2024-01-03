import { IsEnum, IsString } from 'class-validator';
import { RoleEnum } from '../../enums/role.enum';

export class ChangeRightsRequestDto {
  @IsString()
  email: string;

  @IsEnum(RoleEnum, { each: true })
  roles: RoleEnum[];
}
