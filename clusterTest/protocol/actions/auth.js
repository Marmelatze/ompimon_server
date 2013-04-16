var action = require("./action").Action,
    binary = require("binary"),
    BufferBuilder = require('buffer-builder'),
    program = require('commander'),
    util = require("util");

exports.Action = Auth;

function Auth() {
    action.call(this);
}

util.inherits(Auth, action);

Auth.prototype.parseType = function(client, type, buf, callback){
    console.log("auth");
    if(type == 0){
        var token = buf.toString('utf8');
        console.log("Token: ", token);
        client.token = token;
    }else if(type == 1){
        console.log("Auth Failed, because something went terrible wrong");
    }
    callback();
};

Auth.prototype.execute = function(client){
    program.prompt('Enter username: ', function(username){
        if(username){
            console.log('Your username is %s', username);
            program.password('Enter password: ', '*', function(password){
                if(password){

                    var auth = new BufferBuilder();
                    auth.appendUInt8(0);
                    auth.appendUInt8(username.length);
                    auth.appendString(username);
                    auth.appendUInt8(password.length);
                    auth.appendString(password);

                    client.write(auth.get());
                }
            });
        }
    });
};