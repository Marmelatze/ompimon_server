var protocol = require("../protocol"),
    Int64 = require('node-int64'),
    BufferBuilder = require("buffer-builder"),
    binary = require("binary"),
    Client = require("../client.js")
;

var client = new Client.client(new Buffer(256));
client.id = "1234567890yyyasdfasdfasdfasdfasd";

// test send
exports.testSend = function(test) {
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x02);

    var data = {
        "lists": [
            {
                "sender": 123,
                "receivers": [
                    {
                        "id": 456,
                        "messages": 1000,
                        "data": 5607
                    },
                    {
                        "id": 968,
                        "messages": 202002,
                        "data": 203938
                    },
                    {
                        "id": 2004,
                        "messages": 2020,
                        "data": 282349
                    }
                ]
            },
            {
                "sender": 456,
                "receivers": [
                    {
                        "id": 123,
                        "messages": 3847,
                        "data": 2929
                    }
                ]
            }
        ]
    };


    protocol.parse(client, buildBinary(data), function(result) {
        var vars = binary.parse(result)
            .word8('actionId')
            .word8('result')
            .vars
        ;
        test.equal(vars.actionId, 0x02);
        test.equal(vars.result, 0);
        test.done();
    });

};

/**
 * Build binary to send to server
 * @param data
 */
function buildBinary(data) {
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x02); // action id
    buffer.appendUInt8(data.lists.length); // list count
    data.lists.forEach(function(list) {
        buffer.appendUInt32BE(list.sender); // sender id
        buffer.appendUInt32BE(list.receivers.length); // receivers
        list.receivers.forEach(function(receiver) {
            buffer.appendUInt32BE(receiver.id); // receiver id
            var messages = new Int64(receiver.messages);
            buffer.appendBuffer(messages.buffer);
            buffer.appendBuffer((new Int64(receiver.data)).buffer);
        });
    });

    return buffer.get();

}