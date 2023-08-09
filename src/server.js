const logs_services = require('./protos/logs_grpc_pb');
const containers_services = require('./protos/containers_grpc_pb');
const hello_services = require('./protos/helloworld_grpc_pb');
const user_services = require('./protos/user_grpc_pb');
const blacklist_services = require('./protos/blacklist_grpc_pb');
const dashboard_services = require('./protos/dashboard_grpc_pb');
const { streamLogs } = require('./services/honeypot/logs');
const { streamContainers } = require('./services/honeypot/containers');
const { putBlackList, getBlackList, putWhiteList } = require('./services/honeypot/blacklist');
const { streamDashboardInformation } = require('./services/honeypot/dashboard');
const { sayHello } = require('./services/hello');
const { signIn, signUp, signOut, resetPassword, changeEmail } = require('./services/user');
const GrpcServer = require('./grpcServer');

/**
 * Starts an RPC server that receives requests for the Logs service at the
 * server port
 */
function main() {
  console.log("🚀 Starting server");

  const server = new GrpcServer();

  //GRPC user service
  server.addService("user", user_services.UserService, {
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    resetPassword: resetPassword,
    changeEmail: changeEmail
  });

  //GRPC stream log service
  server.addService("logs", logs_services.LogsService, {streamLogs : streamLogs});
  server.addService("containers", containers_services.ContainersService, {streamContainers : streamContainers});
  server.addService("blacklist", blacklist_services.BlacklistService, {
    putBlackList: putBlackList,
    getBlackList: getBlackList,
    putWhiteList: putWhiteList,
  });
  server.addService("dashboard", dashboard_services.DashboardService, {
    streamDashboardInformation: streamDashboardInformation,
  });

  //GRPC hello world service
  server.addService("hello", hello_services.GreeterService, {sayHello : sayHello});

  server.start(50051);
}

main();