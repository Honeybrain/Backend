import { IsBoolean, IsString } from 'class-validator';

export class ChangeLanguageRequestDto {
  @IsString()
  language: string;
}
