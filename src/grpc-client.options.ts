import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_URL,
    package: ['logs', 'dashboard', 'containers', 'blacklist', 'user', 'rules'], // proto package name
    protoPath: [
      './logs/_utils/logs.proto',
      './dashboard/_utils/dashboard.proto',
      './containers/_utils/containers.proto',
      './blacklist/_utils/blacklist.proto',
      './user/_utils/user.proto',
      './rules/_utils/rules.proto',
    ].map((x) => join(__dirname, x)), // proto file path
  },
};
