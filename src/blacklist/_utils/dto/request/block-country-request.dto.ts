import { IsString } from 'class-validator';

export class BlockCountryRequestDto {
  @IsString()
  countryCode: string;
}
