var _ = require("underscore")._,
    BufferBuilder = require('buffer-builder')
;


var actions = {
    0x00: 'auth',
    0x01: 'init',
//    0x02: 'send',
    0xFF: 'finalize'
};

var actionMap = {};
_.each(actions, function(actionClass, id) {
    var action = require('./actions/' + actionClass).Action;
    actionMap[id] = new action();
});

/**
 * Parse a received message
 * @param client
 * @param buf Buffer with received message
 * @param callback will be called on error or success, first param buffer function(buf) {...}
 */
exports.parse = function(client, buf, callback) {
    var result;
    var action = buf.readUInt8(0);
    var actionClass = actionMap[action];
    if (!actionClass) {
        result = new BufferBuilder();
        result.appendUInt8(0x02); // invalid input
        callback(result.get());

        return;
    }

    if (!client.authenticated && actionClass.needAuthentication) {
        result = new BufferBuilder();
        result.appendUInt8(0x03); // not authenticated
        callback(result.get());

        return;
    }

    actionClass.parse(client, buf.slice(1, buf.length), callback);
};