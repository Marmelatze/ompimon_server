var
    fs = require("fs"),
    net = require("net"),
    Client = require("ompimon-cluster/client"),
    Parser = require("ompimon-protocol/parser"),
    stub = require("ompimon-protocol/test-stub"),

    BufferBuilder = require("buffer-builder")
;

var files = false;

var queue = [];

for (var i = 0; i < process.argv.length - 2; i++) {
    var file = process.argv[i+2];
    console.log(file);
    var content = fs.readFileSync(file);

    queue.push(content);
}

var client = net.connect({port: 8214}, function() {
    console.log('client connected');
    client.on('data', function (data) {
        console.log("received:");
        console.log(data);
        var parser = new Parser(data);
        var action = parser.readUInt8();
        var status = parser.readUInt8();
        if (action == 1 && status == 0) {
            setInterval(function() {
                send();
            }, 5000);
        }
    });

    sendInit();
});

function sendInit() {
    client.write(getInit());
}


function send() {
    client.write(getData());
}


var ranks = [1, 2, 3, 4, 5];

function getInit() {
    if (files) {
        return  fs.readFileSync("examples/action1out0.bin");
    }

    var data = stub.initData;
    data.ranks = ranks;
    data.processes = 5;
    data.nodes = 1;
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x01);
    buffer.appendBuffer(stub.buildInit(data).get());

    return buffer.get();
}

function getData() {
    if (files) {
        return fs.readFileSync("examples/action2out2.bin");
    }

    var buildData = function(ownRank) {
        var result = [];
        ranks.forEach(function (rank) {
            if (rank == ownRank || Math.round(Math.random()) == 1) {
                return;
            }

            result.push({
                rank: rank,
                counter: random(),
                size: random()
            });
        });

        return result;
    };

    var data = [];
    ranks.forEach(function(rank) {
        data.push({
            rank: rank,
            counters: {
                broadcast: random(),
                barrier: random()
            },
            data: buildData(rank)
        })
    });

    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x02);
    buffer.appendBuffer(stub.buildSend(data).get());

    return buffer.get();
}


function random() {
    return Math.round(Math.random() * 10000);
};