import { IsString } from 'class-validator';

export class SetRulesDto {
  @IsString()
  rules: string;
  @IsString()
  filters: string;
}
