var protocol = require("../protocol"),
    auth = require("../auth").auth,
    BufferBuilder = require("buffer-builder"),
    binary = require("binary"),
    client = require("../client.js");

auth.type = "test"; // make authentication testable

var client = new client.client(new Buffer(256));
client.id = "1234567890yyyasdfasdfasdfasdfasd";

// test successfull auth

exports.testAuthSuccess = function(test) {
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x00);
    var username = "test";
    var password = "test";
    buffer.appendUInt8(username.length);
    buffer.appendString(username);
    buffer.appendUInt8(password.length);
    buffer.appendString(password);

    protocol.parse(client, buffer.get(), function(result) {
        var vars = binary.parse(result)
            .word8('actionId')
            .word8('result')
            .buffer('id', 32)
            .vars
        ;
        test.equal(vars.actionId, 0x00);
        test.equal(vars.result, 0);
        test.equal(vars.id.toString('utf8'), client.id);
        test.done();
    });

};
// test failing auth
exports.testAuthFailure = function(test) {
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x00);
    var username = "test2";
    var password = "test2";
    buffer.appendUInt8(username.length);
    buffer.appendString(username);
    buffer.appendUInt8(password.length);
    buffer.appendString(password);

    protocol.parse(client, buffer.get(), function(result) {
        var vars = binary.parse(result)
            .word8('actionId')
            .word8('result')
            .vars
        ;
        test.equal(vars.actionId, 0x00);
        test.equal(vars.result, 1);
        test.done();
    });
};

