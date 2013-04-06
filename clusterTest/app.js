/**
 * @author Lukas Schmitt <schmitt@w3p.cc>
 * Date: 03.04.13
 * Time: 09:28
 *
 */
var net = require('net');
var BufferBuilder = require('buffer-builder');
var program = require('commander');

var client = net.connect({port: 8214}, function() { //'connect' listener
    //var username = 'test';
    //var password = 'install';
    console.log('client connected');

    program.prompt('Enter username: ', function(username){
        console.log('Your username is %s', username);

        program.password('Enter password: ', '*', function(password){
            process.stdin.destroy();
            auth(username, password);
        });

    });
});

client.on('data', function(data) {
    console.log(data.toString('utf8'));
});
client.on('end', function() {
    console.log('client disconnected');

});

function auth(username, password){

    var auth = new BufferBuilder();
    auth.appendUInt8(0);
    auth.appendUInt8(username.length);
    auth.appendString(username);
    auth.appendUInt8(password.length);
    auth.appendString(password);

    client.write(auth.get());
}