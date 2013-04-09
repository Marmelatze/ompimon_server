var _ = require("underscore")._,
    binary = require('binary');

var actions = {
    0x00: 'auth'//,
//    0x01: 'init',
//    0x02: 'send',
//    0xFF: 'finalize'
};

var actionMap = {};
_.each(actions, function(actionClass, id) {
    var action = require('./actions/' + actionClass).Action;
    actionMap[id] = new action();
});

exports.parse = function(buf){
    //var parseData = binary.parse(data).word8lu('type').vars;
    //console.dir(parseData);
    var action = buf.readUInt8(0);
    var actionClass = actionMap[0x00];

    if (actionClass) {
        //actionClass.parse(buf.slice(1, buf.length));
        actionClass.parse(buf);
    }


};