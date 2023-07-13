import grpc from '@grpc/grpc-js';
import logs from './services/logs.js';

const server = new grpc.Server();

server.addService(logs.service, logs.handlers);

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server running at http://0.0.0.0:50051');
  server.start();
});
