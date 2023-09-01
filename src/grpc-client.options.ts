import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: ['logs', 'helloworld', 'dashboard', 'containers', 'blacklist', 'user'], // proto package name
    protoPath: [
      './logs/_utils/logs.proto',
      './helloworld/_utils/helloworld.proto',
      './dashboard/_utils/dashboard.proto',
      './containers/_utils/containers.proto',
      './blacklist/_utils/blacklist.proto',
      './user/_utils/user.proto',
    ].map((x) => join(__dirname, x)), // proto file path
  },
};
