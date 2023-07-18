var messages = require('../proto/js/logs_pb');
var fs = require('fs');

/**
 * Implements the StreamLogs RPC method.
 */
function StreamLogs(call) {
  let watcher;

  if (watcher) {
    watcher.close();
  }

  watcher = fs.watch('/honeypot/fast.log', (eventType, filename) => {
    if (eventType === 'change') {
      const logContent = fs.readFileSync('/honeypot/fast.log', 'utf8');
      const response = new messages.LogReply();
      response.setContent(logContent);
      call.write(response);
    }
  });
}

module.exports = {
  StreamLogs: StreamLogs
};
