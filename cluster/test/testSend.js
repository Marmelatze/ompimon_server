var protocol = require("../protocol"),
    Int64 = require('node-int64'),
    BufferBuilder = require("buffer-builder"),
    binary = require("binary"),
    Client = require("../client.js")
    protoSend = require("../protocol/actions/send")
;

var action = new protoSend.Action();

var data = {
    "lists": [
        {
            "sender": 123,
            "receivers": [
                {
                    "id": 456,
                    "messages": '0000000000000010',
                    "data": 'ffffffffffffffff'
                },
                {
                    "id": 968,
                    "messages": '00000000000000bf',
                    "data": '00000000000000af'
                },
                {
                    "id": 2004,
                    "messages": '0000000000002020',
                    "data": '0000000000282349'
                }
            ]
        },
        {
            "sender": 456,
            "receivers": [
                {
                    "id": 123,
                    "messages": '0000000000003847',
                    "data": '0000000000002929'
                }
            ]
        }
    ]
};

var client = new Client.client(new Buffer(256));
client.id = "1234567890yyyasdfasdfasdfasdfasd";

// test parsing
exports.testParse = function(test) {

    var buffer = buildBinary(data);

    var result = action.parse(buffer);
    test.deepEqual(data, result);
    test.done();
};

/**
 * Build binary to send to server
 * @param data
 */
function buildBinary(data) {
    var buffer = new BufferBuilder();
    //buffer.appendUInt8(0x02); // action id
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