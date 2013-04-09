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

Send.prototype.parse = function(client, buf, callback) {
    var offset = 0;
    console.log(buf);
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
        console.log(receiverCount);
        for (var j = 0; j < receiverCount; j++) {
            var receiver = {
                id: null,
                messages: null,
                data: null
            };
            process.receivers.push(receiver);
            receiver.id = buf.readUInt32BE(offset);
            offset += 4;
            receiver.messages = new Int64(buf.slice(offset, offset + 8)).toString();
            offset += 8;
            receiver.data = new Int64(buf.slice(offset, offset+8)).toString();
            offset += 8;
        }
    }


    console.log(JSON.stringify(lists, null, 2));




};