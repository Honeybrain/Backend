const messages = require('../../protos/dashboard_pb');
const dashboardEvents = require('./dashboardEvents');
const { streamContainers } = require('./containers');
const { streamLogs } = require('./logs');
const { getBlackList } = require('./blacklist');

function gatherAndSendData(call) {
    let dashboardData = {};

    return (type, data) => {
        dashboardData[type] = data;

        const reply = new messages.DashboardReply();
        reply.setContainersList(dashboardData.containers);
        reply.setIpsList(dashboardData.blacklist);
        reply.setLogs(dashboardData.logs);
        call.write(reply);

        // Réinitialisez pour la prochaine série de données
        dashboardData = {};
    };
}

/**
 * Implements the streamDashboardInformation RPC method.
 */
function streamDashboardInformation(call) {
    const sendData = gatherAndSendData(call);

    dashboardEvents.on('data', sendData);

    getBlackList(call, true);
    streamContainers(call, true);
    streamLogs(call, true);
}

module.exports = {
    streamDashboardInformation: streamDashboardInformation
};
