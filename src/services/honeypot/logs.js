const messages = require('../../protos/logs_pb');
const chokidar = require('chokidar');
const fs = require('fs');
const dashboardEvents = require('./dashboardEvents');

let watchers = new Map();

function processFileChange(path, call, emitEvent = false) {
    console.log(`File ${path} has been changed or added`);
    try {
        const logContent = fs.readFileSync(path, 'utf8');

        if (emitEvent) {
            dashboardEvents.emit('data', 'logs', logContent);
        } else {
            const reply = new messages.LogReply();
            reply.setContent(logContent);
            call.write(reply);
        }
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        const errorReply = new messages.LogReply();
        errorReply.setContent(`Error reading file: ${err}`);
        call.write(errorReply);
        call.end();
    }
}

/**
 * Implements the StreamLogs RPC method.
 */
function streamLogs(call, emitEvent = false) {
    const watcher = chokidar.watch('/app/honeypot/fast.log', {
        persistent: true,
    });

    watchers.set(call, watcher);

    watcher
        .on('add', path => {
            processFileChange(path, call, emitEvent);
        })
        .on('change', path => {
            processFileChange(path, call, emitEvent);
        })
        .on('error', error => console.log(`Watcher error: ${error}`))

    call.on('end', () => {
        watcher.close();
        watchers.delete(call);
    });
}

module.exports = {
    streamLogs: streamLogs
};
