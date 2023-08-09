const EventEmitter = require('events');

class DashboardEventEmitter extends EventEmitter {}
const dashboardEvents = new DashboardEventEmitter();

module.exports = dashboardEvents;