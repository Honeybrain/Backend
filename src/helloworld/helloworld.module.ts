import { Module } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { HelloworldController } from './helloworld.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HELLOWORLD_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'helloworld',
          protoPath: join(__dirname, './_utils/helloworld.proto'),
        },
      },
    ]),
  ],
  controllers: [HelloworldController],
  providers: [HelloworldService],
})
export class HelloworldModule {}
