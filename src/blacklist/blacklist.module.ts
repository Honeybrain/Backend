import { Module } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { BlacklistController } from './blacklist.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BLACKLIST_PACKAGE',
        transport: Transport.GRPC,
        options: { package: 'blacklist', protoPath: join(__dirname, './_utils/blacklist.proto') },
      },
    ]),
  ],
  controllers: [BlacklistController],
  providers: [BlacklistService],
})
export class BlacklistModule {}
