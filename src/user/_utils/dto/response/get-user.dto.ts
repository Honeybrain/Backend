import { RoleEnum } from '../../enums/role.enum';

export class GetUserDto {
  id: string;
  email: string;
  roles: RoleEnum[];
  activated: boolean;
  lan: string;
}
