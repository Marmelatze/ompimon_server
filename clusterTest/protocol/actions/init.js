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


Init.prototype.parse = function(buf) {
    console.log("init parse");
    action.prototype.parse(buf);
};

Init.prototype.parseType = function(type, buf){
    if(type == 0){
        console.log("success");
    }else if(type == 1){
        console.log("Init Failed, because something went terrible wrong");
    }
};

Init.prototype.execute = function(client){
    console.log("init execute");
};