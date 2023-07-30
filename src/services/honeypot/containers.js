const Docker = require('dockerode');
const messages = require('../../protos/containers_pb');
const docker = new Docker();

// Handle container event outside the function
function handleContainerEvent(call) {
    docker.getNetwork('honeypot_network').inspect({ all: true }, (err, networkData) => {
        if (err) {
            console.error(`exec error: ${err}`);
            return;
        }

        const networkContainers = networkData.Containers;
        const containerIds = Object.keys(networkContainers);

        docker.listContainers({ all: true }, (err, containers) => {
            if (err) {
                console.error(`exec error: ${err}`);
                return;
            }

            const buildContainers = containers.filter(container => container.Names[0].startsWith('/honeypot_'));

            const containersData = buildContainers.map(container => {
                const networkContainerKey = containerIds.find(key => key.startsWith(container.Id));
                const networkContainer = networkContainerKey ? networkContainers[networkContainerKey] : undefined;

                const containerProto = new messages.Container();
                containerProto.setName(container.Names[0].substring(1));
                containerProto.setStatus(container.State);
                containerProto.setIp(networkContainer ? networkContainer.IPv4Address.split("/")[0] : 'Not found');
                return containerProto;
            });

            const reply = new messages.ContainersReply();
            reply.setContainersList(containersData);
            call.write(reply);
        });
    });
}

function streamContainers(call) {
    handleContainerEvent(call); // Send initial state of containers

    docker.getEvents({}, (err, data) => {
        if (err) {
            call.emit('error', err);
            return;
        }

        data.on('data', (chunk) => {
            const event = JSON.parse(chunk.toString('utf8'));

            if (event.Type === 'container') {
                handleContainerEvent(call);
            }
        });

        data.on('end', () => {
            call.end();
        });
    });
}

module.exports = {
    streamContainers: streamContainers
};
