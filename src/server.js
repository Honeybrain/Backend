const logs_services = require('./proto/js/logs_grpc_pb');
const hello_services = require('./proto/js/helloworld_grpc_pb');
const { streamLogs } = require('./services/logs');
const { sayHello } = require('./services/hello');
const GrpcServer = require('./GrpcServer');

/**
 * Starts an RPC server that receives requests for the Logs service at the
 * server port
 */
function main() {
  const server = new GrpcServer();
  server.addService(logs_services.LogsService, {streamLogs : streamLogs});
  server.addService(hello_services.GreeterService, {sayHello : sayHello});
  server.start(50051);
}

main();