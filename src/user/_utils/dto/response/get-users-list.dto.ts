import { IsArray, IsString } from 'class-validator';

export class GetUsersListDto {
  @IsArray()
  @IsString({ each: true })
  users: string[];
}
