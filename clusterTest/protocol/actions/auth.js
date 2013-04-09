var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder')
    ;

exports.Action = Auth;

function Auth() {
    action.call(this);
}

// inherit action
Auth.super_ = action;
Auth.prototype = Object.create(action.prototype);

Auth.prototype.parse = function(buf) {
    //var parseData = binary.parse(data).word8lu('type').vars;
    console.log("auth");
    var type = buf.readUInt8(0);
    buf = buf.slice(1,buf.length);
    if(type == 0){
        console.log("type = 0");
        var token = buf.toString('utf8');
        console.log("Token: ",token);
    }else if(type == 1){
        console.log("type = 1");
    }else if(type == 2){
        console.log("type = 2");
    }else if(type == 3){
        console.log("type = 3");
    }
    /*var vars = binary.parse(buf)
            .word8('userLength')
            .buffer('username', 'userLength')
            .word8('passLength')
            .buffer('password', 'passLength')
            .vars
        ;*/
};