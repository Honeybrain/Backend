import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DASHBOARD_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: ['dashboard', 'logs', 'containers', 'blacklist'],
          protoPath: [
            join(__dirname, './_utils/dashboard.proto'),
            join(__dirname, '../logs/_utils/logs.proto'),
            join(__dirname, '../containers/_utils/containers.proto'),
            join(__dirname, '../blacklist/_utils/blacklist.proto'),
          ],
        },
      },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
