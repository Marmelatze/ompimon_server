var _ = require("underscore")._,
    binary = require('binary');

var actions = {
    0x00: 'auth',
    0x01: 'init'
//    0x02: 'send',
//    0xFF: 'finalize'
};

var actionMap = {};
_.each(actions, function(actionClass, id) {
    var action = require('./actions/' + actionClass).Action;
    actionMap[id] = new action();
});

exports.parse = function(buf, callback){
    var actionId = buf.readUInt8(0);
    var actionClass = this.getActionClass(actionId);
    if (actionClass) {
        actionClass.parse(buf.slice(1, buf.length), callback);
    }
};

exports.execute = function(client, actionId){
    var actionClass = this.getActionClass(actionId);
    if(actionClass){
        actionClass.execute(client);
    }else{
        console.log("Ups, something is broken!");
    }

};

exports.getActionClass = function(actionId){
        return actionMap[actionId];
};