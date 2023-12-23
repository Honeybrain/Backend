import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from './get-user.dto';

export class UserResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  user: GetUserDto;
}
