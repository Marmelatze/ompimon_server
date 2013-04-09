var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder')
;

exports.Action = Send;

function Send() {
    action.call(this);
}


// inherit action
Send.super_ = action;
Send.prototype = Object.create(action.prototype);

Send.prototype.parse = function(client, buf, callback) {
    var pointer = 1;
    var vars = binary.parse(buf)
        .word8('listCount')
        .buffer('lists', 'listCount')
        .vars
    ;

    console.log(vars);


};