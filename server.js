var services = require('./proto/js/logs_grpc_pb');
var { StreamLogs } = require('./services/logs');
var GrpcServer = require('./GrpcServer');

/**
 * Starts an RPC server that receives requests for the Logs service at the
 * server port
 */
function main() {
  var server = new GrpcServer();
  server.addService(services.LogsService, {StreamLogs : StreamLogs});
  server.start(50051);
}

main();