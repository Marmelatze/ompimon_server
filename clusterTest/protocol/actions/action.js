var eventEmitter = require('events').EventEmitter
    ;


exports.Action = Action;

function Action () {
    eventEmitter.call(this);
}

// inherit events.EventEmitter
Action.super_ = eventEmitter;
Action.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Action,
        enumerable: false
    }
});

Action.prototype.parse = function(buf, callback) {
    var type = buf.readUInt8(0);
    buf = buf.slice(1,buf.length);
    if(type == 0){
        console.log("type = 0");
    }else if(type == 1){
        console.log("type = 1");
    }else if(type == 2){
        console.log("type = 2");
    }else if(type == 3){
        console.log("type = 3");
    }
    this.parseType(type,buf, callback);
};

Action.prototype.parseType = function(type, buf, callback){
    console.log("not implemented");
};

Action.prototype.execute = function(client){

};