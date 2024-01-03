import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLanguageResponseDto {
  @ApiProperty()
  @IsString()
  lan: string;
}
