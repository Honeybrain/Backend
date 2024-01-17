import { IsBoolean } from 'class-validator';

export class NightModeRequestDto {
  @IsBoolean()
  nightMode: boolean;
}
