import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONTAINERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'containers',
          protoPath: join(__dirname, './_utils/containers.proto'),
        },
      },
    ]),
  ],
  controllers: [ContainersController],
  providers: [ContainersService],
})
export class ContainersModule {}
