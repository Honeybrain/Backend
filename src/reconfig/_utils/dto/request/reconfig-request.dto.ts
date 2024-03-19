import { IsString } from "class-validator";

export class ReConfigDto {

  @IsString()
  config: string;
}