import { ApiProperty } from '@nestjs/swagger';

export class GetEmptyDto {
  @ApiProperty()
  message: string;
}
