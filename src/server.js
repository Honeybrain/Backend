const logs_services = require('./proto/js/logs_grpc_pb');
const hello_services = require('./proto/js/helloworld_grpc_pb');
const user_services = require('./proto/js/user_grpc_pb');
const { streamLogs } = require('./services/logs');
const { sayHello } = require('./services/hello');
const { SignIn, SignUp, SignOut, ResetPassword, ChangeEmail } = require('./services/user');
const GrpcServer = require('./grpcServer');

/**
 * Starts an RPC server that receives requests for the Logs service at the
 * server port
 */
function main() {
  const server = new GrpcServer();

  //GRPC user service
  server.addService(user_services.UserService, {
    SignIn: SignIn,
    SignUp: SignUp,
    SignOut: SignOut,
    ResetPassword: ResetPassword,
    ChangeEmail: ChangeEmail
  });

  //GRPC stream log service
  server.addService(logs_services.LogsService, {streamLogs : streamLogs});

  //GRPC hello world service
  server.addService(hello_services.GreeterService, {sayHello : sayHello});

  server.start(50051);
}

main();