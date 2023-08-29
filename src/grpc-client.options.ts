import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: '...', // proto package name
    protoPath: join(__dirname, './proto/....proto'), // proto file path
  },
};
