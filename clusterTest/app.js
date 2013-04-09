/**
 * @author Lukas Schmitt <schmitt@w3p.cc>
 * Date: 03.04.13
 * Time: 09:28
 *
 */
var net = require('net'),
    BufferBuilder = require('buffer-builder'),
    binary = require('binary'),
    program = require('commander'),
    protocol = require('./protocol');

var client = net.connect({port: 8214}, function() {
    console.log('client connected');

    auth();
});

client.on('data', function(data) {
    console.log("received:", data);
    //console.log(data.toString('utf8'));
    protocol.parse(data);
});
client.on('end', function() {
    console.log('client disconnected');

});

function auth(){
    client.pause();
    program.prompt('Enter username: ', function(username){
        console.log('Your username is %s', username);

        program.password('Enter password: ', '*', function(password){
            process.stdin.destroy();
            var auth = new BufferBuilder();
            auth.appendUInt8(0);
            auth.appendUInt8(username.length);
            auth.appendString(username);
            auth.appendUInt8(password.length);
            auth.appendString(password);

            client.write(auth.get());
            client.resume();
        });

    });


}