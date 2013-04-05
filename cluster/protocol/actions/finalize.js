var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder')
;

exports.Action = Finalize;

function Finalize() {
    action.call(this);
}


// inherit action
Finalize.super_ = action;
Finalize.prototype = Object.create(action.prototype);

Finalize.prototype.parse = function(client, buf, callback) {
    var result = new BufferBuilder();
    result.append(0x00); // all ok

    callback(result.get());
};