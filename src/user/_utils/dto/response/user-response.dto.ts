import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  rights: boolean;
}
