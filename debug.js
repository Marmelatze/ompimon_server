var
    fs = require("fs"),
    _ = require("underscore"),
    net = require("net"),
    async = require("async"),
    globals = require("ompimon-protocol/globals"),
    stub = require("ompimon-protocol/test-stub")

    ;

var clusterActions = {};

_.each(globals.clusterActions, function(actionClass, id) {
    var action = require('ompimon-protocol/cluster_actions/' + actionClass);

    var instance = new action();
    clusterActions[id] = instance;
    instance.code = id;
    instance.on('send', function (client, message) {
        if (null === message) {
            return;
        }
        console.log(message);
        self._send(client, message);
    });
}, this);

var args = process.argv;
args.splice(0, 2);

var files = _.sortBy(args, function(arg) {
    return parseInt(arg.replace(/[^0-9]+/, ""));
});

var client = stub.getTestClient("Debug");
client.app.counterFunctions = ['MPI_Cast', 'MPI_Allreduce', 'MPI_Barrier'];
client.app.sendFunctions = ['Accumulated', 'MPI_SEND', 'MPI_Receive', 'MPI_isend'];
client.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];


files.forEach(function(file) {
    console.log(file);

});
