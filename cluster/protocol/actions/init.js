var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder')
;

exports.Action = Init;

function Init() {
    action.call(this);
}


// inherit action
Init.super_ = action;
Init.prototype = Object.create(action.prototype);

Init.prototype.parse = function(client, buf, callback) {
    var pointer = 1;
    var vars = binary.parse(buf)
        .word8('nameLength')
        .buffer('name', 'nameLength')
        .word32('processes')
        .word32('nodes')
        .vars
    ;
    console.log(vars);
    //TODO: save to redis

};