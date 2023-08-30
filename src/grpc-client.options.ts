import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['logs', 'helloworld'], // proto package name
    protoPath: ['./logs/_utils/logs.proto', './helloworld/_utils/helloworld.proto'].map((x) => join(__dirname, x)), // proto file path
  },
};
