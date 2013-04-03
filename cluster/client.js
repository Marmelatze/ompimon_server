var eventEmitter = require('events').EventEmitter
;


exports.client = Client;

function Client (socket) {
    eventEmitter.call(this);
    this.socket = socket;
    this.authenticated = false;
}

// inherit events.EventEmitter
Client.super_ = eventEmitter;
Client.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Client,
        enumerable: false
    }
});
