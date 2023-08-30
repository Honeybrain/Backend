import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/config';
import { HelloworldModule } from './helloworld/helloworld.module';
import { LogsModule } from './logs/logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContainersModule } from './containers/containers.module';
import { BlacklistModule } from './blacklist/blacklist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }),
    HelloworldModule,
    LogsModule,
    DashboardModule,
    ContainersModule,
    BlacklistModule,
  ],
})
export class AppModule {}
