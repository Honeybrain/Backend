import { IsString } from 'class-validator';

export class HistoryEntryDto {
  @IsString()
  date: string;

  @IsString()
  actionType: string;

  @IsString()
  description: string;
}
