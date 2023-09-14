import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ContainersModule } from '../containers/containers.module';
import { LogsModule } from '../logs/logs.module';
import { BlacklistModule } from '../blacklist/blacklist.module';

@Module({
  imports: [ContainersModule, LogsModule, BlacklistModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
