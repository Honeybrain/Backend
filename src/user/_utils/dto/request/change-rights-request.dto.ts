import { IsBoolean, IsString } from 'class-validator';

export class ChangeRightsRequestDto {
  @IsString()
  email: string;

  @IsBoolean()
  admin: boolean;
}
