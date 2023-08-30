import { Module } from '@nestjs/common';
import { HelloworldService } from './helloworld.service';
import { HelloworldController } from './helloworld.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';

@Module({
  imports: [ClientsModule.register([{ name: 'HELLOWORLD_PACKAGE', ...grpcClientOptions }])],
  controllers: [HelloworldController],
  providers: [HelloworldService],
})
export class HelloworldModule {}
