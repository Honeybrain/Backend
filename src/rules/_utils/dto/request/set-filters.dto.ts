import { IsString } from 'class-validator';

export class SetFiltersDto {
  @IsString()
  filters: string;
}
