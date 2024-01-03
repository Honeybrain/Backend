import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WireguardConfigResponseDto {
  @ApiProperty()
  @IsString()
  base64Image: string;
}
