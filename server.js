var net = require('net');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
        console.log("forked");
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    startServer();
}


function startServer() {
    var port = 8214;
    var server = net.createServer(function (c) { //'connection' listener
        console.log('server connected');
        c.on('end', function () {
            console.log('server disconnected');
        });
        c.write('hello\r\n');
        c.pipe(c);
    });


    server.listen(port, function () { //'listening' listener
        console.log("Server started on port " + port);
    });

}
