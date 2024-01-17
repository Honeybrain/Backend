import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { HistoryModule } from 'src/history/history.module';

@Module({
  controllers: [BlacklistController],
  providers: [BlacklistService],
  imports: [HistoryModule],
  exports: [BlacklistService],
})
export class BlacklistModule {}
