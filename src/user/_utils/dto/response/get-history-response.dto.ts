import { HistoryEntryDto } from '../request/history-entry.dto';

export class GetHistoryResponseDto {
  entries: HistoryEntryDto[]; // Un tableau représentant l'historique des actions de l'utilisateur
}
