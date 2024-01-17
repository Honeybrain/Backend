import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from './history.schema';
import { HistoryService } from './history.service';
import { HistoryRepository } from './history.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }])],
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryService, HistoryRepository],
})
export class HistoryModule {}

