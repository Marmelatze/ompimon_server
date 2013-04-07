var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
numCPUs = 1;

var worker = require("./worker");

if (numCPUs <= 1) {
    new worker.worker(8214);

    return;
}

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
        console.log("forked");
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
        cluster.fork();
    });
} else {
    new worker.worker(8214);
}
