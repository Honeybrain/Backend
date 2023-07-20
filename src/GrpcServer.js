const grpc = require('@grpc/grpc-js');

class GrpcServer {
  constructor() {
    this.server = new grpc.Server();
  }

  addService(serviceDef, serviceImpl) {
    this.server.addService(serviceDef, serviceImpl);
  }

  start(port) {
    this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
      if (err) {
        return console.error(err);
      }
      console.log(`Server listening on port ${port}`);
      this.server.start();
    });
  }
}

module.exports = GrpcServer;