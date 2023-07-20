var messages = require('../proto/js/logs_pb');

/**
 * Implements the StreamLogs RPC method.
 */
function streamLogs(call, callback) {
  console.log("hella");
  call.on('data', function(feature) {
    console.log("data");
  });
  call.on('end', function() {
    console.log("end");
    // The server has finished sending
  });
  call.on('error', function(e) {
    console.log("error");
    // An error has occurred and the stream has been closed.
  });
  call.on('status', function(status) {
    console.log("status");
    // process status
  });
  const reply = new messages.LogReply();
  reply.setContent('feur');
  callback(null, reply);
}

module.exports = {
  streamLogs: streamLogs
};
