import fs from 'fs';
import logs from '../protos/js/logs_grpc_pb.js';
import { LogResponse } from '../protos/js/logs_pb.js';

let watcher;

const handlers = {
  StreamLogs: (call) => {
    if (watcher) {
      watcher.close();
    }

    watcher = fs.watch('/honeypot/fast.log', (eventType, filename) => {
      if (eventType === 'change') {
        const logContent = fs.readFileSync('/honeypot/fast.log', 'utf8');
        const response = new LogResponse();
        response.setContent(logContent);
        call.write(response);
      }
    });
  }
};

export default {
  service: logs.LogService,
  handlers
};
