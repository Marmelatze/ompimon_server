var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder'),
    program = require('commander'),
    util = require("util")
    ;

exports.Action = Init;

function Init() {
    action.call(this);
}

util.inherits(Init, action);


Init.prototype.parseType = function(client, type, buf, callback){
    if(type == 0){
        console.log("success");
    }else if(type == 1){
        console.log("Init Failed, because something went terrible wrong");
    }

    callback();
};

Init.prototype.execute = function(client){
    program.prompt('Enter Application name: ', function(appName){
        if(appName){
            program.prompt('Enter Username: ', function(username){
                if(username){
                    program.prompt('How many nodes are in use? ', function(nodes){
                        var processes = Math.floor(Math.random()*11)*nodes;

                        var init = new BufferBuilder();
                        init.appendUInt8(1);
                        init.appendUInt8(appName.length);
                        init.appendString(appName);
                        init.appendUInt8(username.length);
                        init.appendString(username);
                        init.appendUInt32BE(processes);
                        init.appendUInt32BE(nodes);

                        client.write(init.get());
                    });
                }
            });
        }
    });
};