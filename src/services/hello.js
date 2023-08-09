const messages = require('../protos/helloworld_pb');

/**
 * Implements the StreamLogs RPC method.
 */
function sayHello(call, callback) {
  console.log("sayHello");
  const reply = new messages.HelloReply();
  reply.setMessage('Hello ' + call.request.getName());
  callback(null, reply);
}

module.exports = {
  sayHello: sayHello
};
