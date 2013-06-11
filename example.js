var
    fs = require("fs"),
    net = require("net"),
    Client = require("ompimon-cluster/client"),
    Parser = require("ompimon-protocol/parser"),
    stub = require("ompimon-protocol/test-stub"),

    BufferBuilder = require("buffer-builder"),

    _ = require("underscore")
;

var instance = process.argv[2] || 0;
console.log("starting instance " + instance);

var client = net.connect({port: 8214}, function() {
    console.log('client connected');
    client.on('data', function (data) {
        console.log("received:");
        console.log(data);
        var parser = new Parser(data);
        var action = parser.readUInt8();

        if (action == 1) {
            var status = parser.readUInt8();
            if (status == 0) {

                setInterval(function() {
                    send();
                }, 500);

            }

        }
        if (action == 3) {
            client.write(getDataDetail());
        }
        if (action == 5 ) {
            var func = parser.readUInt32();
            client.write(getSendDetail(func));
        }
        if (action == 0xFE) {
            var buffer = new BufferBuilder();
            buffer.appendUInt8(0xFF);
            client.write(buffer.get());
        }
        if (action == 0xFF) {
            var buffer = new BufferBuilder();
            buffer.appendUInt8(0xFF);
            client.write(buffer.get());
            process.exit();
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


var ranks = [1, 2];
if (instance > 0) {
    ranks = _.map(ranks, function(rank) {
        return rank+(2*instance);
    });
}
console.log(ranks);
var sends = ['ibsend', 'bsend', 'rsend'];

function getInit() {

    var data = stub.initData;
    data.app = "Dummy node app";
    data.ranks = ranks;
    data.processes = 10;
    data.nodes = 2;
    data.nodeId = instance;
    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x01);
    buffer.appendBuffer(stub.buildInit(data).get());

    return buffer.get();
}

function getData() {
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

function getDataDetail() {
    console.log("get data detail");

    var buildFunctions = function(ownRank) {
        var funcs = {};
        sends.forEach(function(send) {
            funcs[send] = [];

            ranks.forEach(function(rank) {
                if (rank == ownRank) {
                    return;
                }
                funcs[send].push({
                    rank: rank,
                    counter: random(),
                    size: random()
                });
            });
        });

        return funcs;
    };

    var data = [];
    ranks.forEach(function (rank) {
        data.push({
            rank: rank,
            functions: buildFunctions(rank)
        });
    });

    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x03);
    buffer.appendBuffer(stub.buildDataDetail(data).get());

    return buffer.get();
}

function getSendDetail(func) {
    console.log("get data for function " + func);

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

    var result = [];
    ranks.forEach(function (rank) {
        result.push({
            rank: rank,
            data: buildData(rank)
        });
    });
    var data = {
        sendId: func,
        data: result
    };

    var buffer = new BufferBuilder();
    buffer.appendUInt8(0x05);
    buffer.appendBuffer(stub.buildSendDetail(data).get());

    return buffer.get();
}

var value = 0;
var plus = true;
var max = 1073741824;
function random() {
    if (plus) {
        value += Math.round(Math.random() * 1024);
        if (value > max) {
            plus = false;
        }
    } else {
        value -= Math.round(Math.random() * 1024);
        if (value <= 0) {
            plus = true;
        }
    }
    return value;
};
