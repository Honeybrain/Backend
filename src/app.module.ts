import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './_utils/config/config';
import { HelloworldModule } from './helloworld/helloworld.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [ConfigModule.forRoot({ validate: validateEnv, isGlobal: true }), HelloworldModule, LogsModule],
})
export class AppModule {}
