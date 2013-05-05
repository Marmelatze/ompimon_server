var
    fs = require("fs"),
    net = require("net"),
    Client = require("ompimon-cluster/client")
;

var file = process.argv[2];
if (!file) {
    console.log("no input file specified");
    process.exit(1);
}

var queue = [];

for (var i = 0; i < process.argv.length - 2; i++) {
    var file = process.argv[i+2];
    console.log(file);
    var content = fs.readFileSync(file);

    queue.push(content);
}

var client = net.connect({port: 8214}, function() {
    console.log('client connected');

    send(queue.shift());

    client.on('data', function (data) {
        console.log("received:");
        console.log(data);
        if (queue.length > 0) {
            send(queue.shift());
        }
    })


});


function send(buffer) {
    client.write(buffer);
}


