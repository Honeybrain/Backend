import { Controller, Get, Post, Body } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  async addHistoryEntry(@Body() dto: any) {
    return this.historyService.addHistoryEntry(dto);
  }

  @Get()
  async getHistory() {
    return this.historyService.getHistory();
  }
}
