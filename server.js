var logs_services = require('./proto/js/logs_grpc_pb');
var hello_services = require('./proto/js/helloworld_grpc_pb');
var { StreamLogs } = require('./services/logs');
var { sayHello } = require('./services/hello');
var GrpcServer = require('./GrpcServer');

/**
 * Starts an RPC server that receives requests for the Logs service at the
 * server port
 */
function main() {
  var server = new GrpcServer();
  server.addService(logs_services.LogsService, {StreamLogs : StreamLogs});
  server.addService(hello_services.GreeterService, {sayHello : sayHello});
  server.start(50051);
}

main();