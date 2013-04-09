var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder'),
    auth = require('../../auth').auth
;

exports.Action = Auth;

function Auth() {
    action.call(this);
}


// inherit action
Auth.super_ = action;
Auth.prototype = Object.create(action.prototype);

Auth.prototype.parse = function(client, buf, callback) {
    var pointer = 1;
    var vars = binary.parse(buf)
        .word8('userLength')
        .buffer('username', 'userLength')
        .word8('passLength')
        .buffer('password', 'passLength')
        .vars
    ;

    this.authenticate(client, vars.username, vars.password, callback);
};

Auth.prototype.authenticate = function(client, username, password, callback) {
    var self = this;

    auth.authenticate(username, password, function() {
        client.authenticated = true;
        callback(self.sendSuccess(client));
    }, function() {
        client.authenticated = false;
        callback(self.sendFailed(client));
    });
};

Auth.prototype.sendSuccess = function(client) {

    var result = new BufferBuilder();
    result.appendUInt8(0x00); // action id
    result.appendUInt8(0);
    result.appendString(client.id);

    return result.get();
};

Auth.prototype.sendFailed = function(client) {

    var result = new BufferBuilder();
    result.appendUInt8(0x00);
    result.appendUInt8(1);

    return result.get();
};