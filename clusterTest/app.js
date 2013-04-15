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

var client = net.connect({port: 8214},function() {
    this.token = '';
    console.log('client connected');

    executeAction();

});


client.on('data', function(data) {
    console.log("received:", data);
    protocol.parse(client, data, function() {
        executeAction();
    });
});
client.on('end', function() {
    console.log('client disconnected');
});


function executeAction(){
    program.prompt('Enter Protocol Action-ID: ', function (actionId) {
        protocol.execute(client, actionId, function(){
            executeAction();
        });
    });
}