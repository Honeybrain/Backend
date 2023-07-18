var messages = require('../proto/js/logs_pb');
var fs = require('fs');

let watcher;

/**
 * Implements the StreamLogs RPC method.
 */
function StreamLogs(call) {
  console.log("StreamLogs called");

  if (watcher) {
    watcher.close();
  }

  watcher = fs.watch('./package.json', (eventType, filename) => {
    if (eventType === 'change') {
      const logContent = fs.readFileSync('./package.json', 'utf8');
      const reply = new messages.LogReply();
      reply.setContent(logContent);
      call.write(reply);
    }
  });

  call.on('end', () => {
    if (watcher) {
      watcher.close();
    }
  });
}

module.exports = {
  StreamLogs: StreamLogs
};
