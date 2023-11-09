import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserNightModeResponseDto {
  @ApiProperty()
  @IsBoolean()
  nightMode: boolean;
}
