var eventEmitter = require('events').EventEmitter,
    net = require('net'),
    client = require('./client'),
    auth = require('./auth').auth
;


exports.worker = Worker;

function Worker (port) {
    eventEmitter.call(this);
    this.port = port;
    this.start();
}

// inherit events.EventEmitter
Worker.super_ = eventEmitter;
Worker.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Worker,
        enumerable: false
    }
});

/**
 * Start listening to incomming connections
 */
Worker.prototype.start = function() {
    var self = this;
    var server = net.createServer(function (c) { //'connection' listener
        var clientInstance = new client.client(c);
        self.connect(clientInstance);
        c.on('end', function () {
            console.log('server disconnected');
        });

    });


    server.listen(this.port, function () { //'listening' listener
        console.log("Server started on port " + self.port);
    });
};

/**
 * Handle connection of new clients
 * @param client
 */
Worker.prototype.connect = function(client) {
    var self = this;
    client.socket.write("Go Away!\r\n");
    client.socket.on('data', function(data) {
        self.process(client, data);
    });
};

/**
 * Process received messages
 * @param client
 * @param data
 */
Worker.prototype.process = function(client, data) {
    data = data.toString('utf-8').trim().replace(/(\r\n|\n|\r)/gm,"");
    console.log("received:" + data);

    var socket = client.socket;

    var args = data.split(" ");
    if (args.length < 0 ) {
        socket.write("Invalid input\r\n");
    }

    if ("quit" == args[0]) {
        socket.write("goodbye\r\n");
        socket.end();

        return;
    }
    if ("auth" == args[0]) {

        var username = args[1];
        var password = args[2];
        auth.authenticate(username, password, function() {
            client.authenticated = true;
            socket.write("OK\r\n");
        }, function() {
            client.authenticated = false;
            socket.write("FAILED\r\n");
        });

        return;
    }

    if (!client.authenticated) {
        socket.write("not authenticated\r\n");
    }


};