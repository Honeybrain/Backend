import { IsString } from 'class-validator';

export class SetIpDto {
  @IsString()
  ip: string;
}
