var action = require("./action").Action,
    binary = require("binary"),
    Int64 = require('node-int64'),
    BufferBuilder = require('buffer-builder'),
    util = require('util')
;

exports.Action = Send;

function Send() {
    action.call(this);
}


// inherit action
Send.super_ = action;
Send.prototype = Object.create(action.prototype);

Send.prototype.parse = function(buf) {
    var offset = 0;
    var listCount = buf.readUInt8(offset++);
    var lists = [];

    for (var i = 0; i < listCount; i++) {
        var process = {
            sender: null,
            receivers: []
        };
        lists.push(process);
        process.sender = buf.readUInt32BE(offset);
        offset += 4;
        var receiverCount = buf.readUInt32BE(offset);
        offset += 4;
        for (var j = 0; j < receiverCount; j++) {
            var receiver = {
                id: null,
                messages: null,
                data: null
            };
            process.receivers.push(receiver);
            receiver.id = buf.readUInt32BE(offset);
            offset += 4;
            receiver.messages = new Int64(buf.slice(offset, offset + 8)).toOctetString();
            offset += 8;
            receiver.data = new Int64(buf.slice(offset, offset+8)).toOctetString();
            offset += 8;
        }
    }

    //console.log(JSON.stringify(lists, null, 2));

    return {
        lists: lists
    };
};

Int64.prototype.toString = function() {

};


Send.prototype.process = function(client, result, callback) {
    //@TODO Implement

    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x02);
    buffer.appendUInt8(0x00);
    callback(buffer.get());
}