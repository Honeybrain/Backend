import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'LOGS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'logs',
          protoPath: join(__dirname, './_utils/logs.proto'),
        },
      },
    ]),
  ],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [ClientsModule],
})
export class LogsModule {}
