import { Module } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { HelloworldController } from './helloworld.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'HELLOWORLD_PACKAGE',
        transport: Transport.GRPC,
        options: { package: 'helloworld', protoPath: 'src/helloworld/_utils/helloworld.proto' },
      },
    ]),
  ],
  controllers: [HelloworldController],
  providers: [HelloworldService],
})
export class HelloworldModule {}
