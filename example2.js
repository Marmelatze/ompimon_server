var
    fs = require("fs"),
    _ = require("underscore"),
    net = require("net")

    ;

var args = process.argv;
args.splice(0, 2);

var files = _.sortBy(args, function(arg) {
    return parseInt(arg.replace(/[^0-9]+/, ""));
});

var client = net.connect({port: 8214}, function() {
    console.log('client connected');

    client.on('data', function (data) {
        console.log("received:");
        console.log(data);
        if (data.readUInt8(0) == 1) {
            send();
        }
    });

    var file = files.shift();
    var content = fs.readFileSync(file);

    client.write(content);

});

function send() {
    while (files.length > 0) {

    }
}