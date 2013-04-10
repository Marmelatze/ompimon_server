var eventEmitter = require('events').EventEmitter,
    net = require('net'),
    client = require('./client'),
    protocol = require('./protocol'),
    crypto = require("crypto"),
    BufferBuilder = require('buffer-builder')

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
            console.log('client '+clientInstance.id+' disconnected');
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
    if (!client.id) {
        client.id = crypto.createHash('md5').update(crypto.randomBytes(512)).digest('hex');
    }
    console.log("client "+ client.id+" connected");
    // client.socket.write("Welcome!\r\n"); // lukas wollte es so!
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
    var string = data.toString('utf-8').trim().replace(/(\r\n|\n|\r)/gm,"");
    console.log("received from " + client.id+":");
    console.log(data);
    console.log(string);
    try {
        protocol.parse(client, data, function(buf) {
            if (null !== buf) {
                client.socket.write(buf);
            }
        });
    } catch (e) {
        console.log(e);
        var result = new BufferBuilder();
        result.appendUInt8(0x02); // invalid input
        client.socket.write(result.get());
    }



};