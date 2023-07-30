const messages = require('../../protos/blacklist_pb');
const Docker = require('dockerode');
const chokidar = require('chokidar');
const fs = require('fs');

const docker = new Docker();

/**
 * Implements the StreamLogs RPC method.
 */
function putBlackList(call, callback) {
    // Extract IP address from request
    const ip = call.request.getContent();

    if (!ip) {
      const error = new Error('IP address is required');
      error.code = grpc.status.INVALID_ARGUMENT;
      callback(error);
      return;
    }

    // Define the command
    const cmd = `fail2ban-client set nginx-honeypot banip ${ip}`;
    const cmd2 = `fail2ban-client set iptables-honeypot banip ${ip}`;

    docker.getContainer('fail2ban').exec({Cmd: cmd.split(' '), AttachStdout: true, AttachStderr: true}, (err, exec) => {
        if (err) {
            const error = new Error('Failed to execute nginx-honeypot banip');
            error.code = grpc.status.INTERNAL;
            callback(error);
            return;
        }

        exec.start((err, stream) => {
            if (err) {
                const error = new Error('Failed to start execution');
                error.code = grpc.status.INTERNAL;
                callback(error);
                return;
            }

            docker.getContainer('fail2ban').exec({Cmd: cmd2.split(' '), AttachStdout: true, AttachStderr: true}, (err, exec) => {
                if (err) {
                    const error = new Error('Failed to execute iptables-honeypot banip');
                    error.code = grpc.status.INTERNAL;
                    callback(error);
                    return;
                }

                exec.start((err, stream) => {
                    if (err) {
                        const error = new Error('Failed to start execution');
                        error.code = grpc.status.INTERNAL;
                        callback(error);
                        return;
                    }

                    const reply = new messages.PutBlackListReply();
                    callback(null, reply);
                });
            });
        });
    });
}

let watchers = new Map();

function processFileChange(path, call) {
    console.log(`File ${path} has been changed or added`);
    try {
        const blockContent = fs.readFileSync(path, 'utf8');

        // Regular expression to match IP addresses
        const regex = /deny\s+((?:\d{1,3}\.){3}\d{1,3});/g;
        let match;
        let ips = [];

        while ((match = regex.exec(blockContent)) !== null) {
            // Push the matched IP address to the array
            ips.push(match[1]);
        }

        const reply = new messages.GetBlackListReply();
        reply.setIpList(ips);
        call.write(reply);
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        call.end();
    }
  }

/**
 * Implements the getBlackList RPC method.
 */
function getBlackList(call) {
    const watcher = chokidar.watch('/app/honeypot/block.conf', {
        persistent: true,
    });

    watchers.set(call, watcher);
  
    watcher
        .on('add', path => {
            processFileChange(path, call);
        })
        .on('change', path => {
            processFileChange(path, call);
        })
        .on('error', error => console.log(`Watcher error: ${error}`));
  
    call.on('end', () => {
        watcher.close();
        watchers.delete(call);
    });
}

module.exports = {
    putBlackList: putBlackList,
    getBlackList: getBlackList
};
