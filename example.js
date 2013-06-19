var
    fs = require("fs"),
    net = require("net"),
    Client = require("ompimon-cluster/client"),
    Parser = require("ompimon-protocol/parser"),
    stub = require("ompimon-protocol/test-stub"),
    cluster = require("cluster"),

    BufferBuilder = require("buffer-builder"),
    color = require("bash-color"),
    util = require("util"),
    _ = require("underscore")
;


var rankCount = 18;
var nodes = 1;

function Node(id, rankCount, nodes) {
    /**
     * Instance id
     * @property id
     * @type Integer
     */
    this.id = id;
    /**
     * Id of the current app
     * @property appId
     * @type Integer|null
     */
    this.appId = null;

    /**
     * Whether the client is started
     * @property started
     * @type {boolean}
     */
    this.started = false;

    this.client = null;

    this.ranks = [];
    this.totalRanks = [];
    this.sends = ['ibsend', 'bsend', 'rsend'];

    this.init(rankCount, nodes);
}

_.extend(Node.prototype, {
    init: function(rankCount, nodes) {
        process.on('message', _.bind(this.handleMessage, this));
        if (this.id == 0) {
            this.start();
        }

        for (var i = 1; i <= rankCount; i++) {
            this.totalRanks.push(i);
        }

        var perNode = Math.floor(rankCount/nodes);

        for (var i = 1; i <= perNode; i++) {
            this.ranks.push(i);
        }
        if (instance > 0) {
            this.ranks = _.map(this.ranks, function(rank) {
                return rank+(perNode*instance);
            });
        }
        console.log(this.totalRanks, this.ranks);

    },

    handleMessage: function(msg) {
        switch(msg.type) {
            case 'init':
                this.appId = msg.appId;
                if (!this.started) {
                    this.start();
                }
                break;
        }
    },
    start: function() {
        this.started = true;
        this.client = net.connect({port: 8214}, function() {
            console.log('client connected');
            this.client.on('data', _.bind(this.handleResponse, this));
            this.sendInit();

        }.bind(this));
    },

    /**
     * Handle response from server
     *
     * @method handleResponse
     * @param data
     */
    handleResponse: function(data) {
        console.log("received:");
        console.log(data);
        var parser = new Parser(data);
        var action = parser.readUInt8();
        switch(action) {
            case 0x01:
                var status = parser.readUInt8();
                console.log(status);
                appId = parser.readUInt32();
                if (status == 0) {
                    this.appId = appId;
                    console.log("init success with id "+appId);
                    if (this.id == 0) {
                        process.send({
                            type: 'init',
                            appId: appId
                        });
                    }

                    setInterval(function() {
                        this.send();
                    }.bind(this), 500);
                }
                break;
            case 0x03:
                this.client.write(this.getDataDetail());
                break;
            case 0x05:
                var func = parser.readUInt8();
                this.client.write(this.getSendDetail(func));
                break;
            case 0xFE:
                var buffer = new BufferBuilder();
                buffer.appendUInt8(0xFF);
                this.client.write(buffer.get());
                break;
            case 0xFF:
                var buffer = new BufferBuilder();
                buffer.appendUInt8(0xFF);
                this.client.write(buffer.get());
                process.exit();
                break;
        }
    },
    sendInit: function () {
        this.client.write(this.getInit());
    },
    send: function () {
        var data = this.getData();
        this.client.write(data);
    },

    getInit: function () {

        var data = stub.initData;
        data.app = "Dummy node app";
        data.appId = this.appId;
        data.ranks = this.ranks;
        data.processes = this.totalRanks.length;
        data.nodes = nodes;
        data.nodeId = instance;
        var buffer = new BufferBuilder();
        buffer.appendUInt8(0x01);
        buffer.appendBuffer(stub.buildInit(data).get());

        return buffer.get();
    },


    getData: function () {
        var buildData = function(ownRank) {
            var result = [];
            this.totalRanks.forEach(function (rank) {
                if (rank == ownRank) {
                    return;
                }

                result.push({
                    rank: rank,
                    counter: random(),
                    size: random()
                });
            });

            return result;
        }.bind(this);

        var data = [];
        this.ranks.forEach(function(rank) {
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
    },

    getDataDetail: function () {
        console.log("get data detail");

        var buildFunctions = function(ownRank) {
            var funcs = {};
            this.sends.forEach(function(send) {
                funcs[send] = [];

                this.totalRanks.forEach(function(rank) {
                    if (rank == ownRank) {
                        return;
                    }
                    funcs[send].push({
                        rank: rank,
                        counter: random(),
                        size: random()
                    });
                });
            }.bind(this));

            return funcs;
        }.bind(this);

        var data = [];
        this.ranks.forEach(function (rank) {
            data.push({
                rank: rank,
                functions: buildFunctions(rank)
            });
        });

        var buffer = new BufferBuilder();
        buffer.appendUInt8(0x03);
        buffer.appendBuffer(stub.buildDataDetail(data).get());

        return buffer.get();
    },

    getSendDetail: function (func) {
        console.log("get data for function " + func);

        var buildData = function(ownRank) {
            var result = [];
            this.ranks.forEach(function (rank) {
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
        }.bind(this);

        var result = [];
        this.ranks.forEach(function (rank) {
            result.push({
                rank: rank,
                data: buildData(rank)
            });
        });
        var data = {
            sendId: func,
            ranks: result
        };

        var buffer = new BufferBuilder();
        buffer.appendUInt8(0x05);
        buffer.appendBuffer(stub.buildSendDetail(data).get());

        return buffer.get();
    }
});



var count = Math.random() * 1024*1024;
function random() {
    count++;
    return Math.round(Math.abs(Math.sin(count/(1024*10)) * 1024 * 1024));
    //return Math.round(Math.random() * 1024*1024);
};

/*
for (var i = 0; i < 1000; i++) {
    console.log(random());
}

process.exit();*/

if (cluster.isMaster) {
    var appId = null;
    function handleMessage(msg) {
        console.log(msg);
        _.each(cluster.workers, function(child) {
            child.send(msg);
        });
    }

    function fork() {
        // Fork workers.
        for (var i = 0; i < nodes; i++) {
            var proc = cluster.fork({
                id: i
            });
            proc.on('message', function(msg) {
                handleMessage(msg);
            });
        }
    }

    fork();

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var colors = [
        color.blue,
        color.green,
        color.purple,
        color.red,
        color.cyan
    ];

    var instance = process.env.id;
    console.log = function(msg) {
        var prefix = "["+instance+"]";
        prefix = colors[instance].call(this, prefix);

        this._stdout.write(prefix+" "+util.format.apply(this, arguments) + '\n');
    };
    new Node(instance, rankCount, nodes);
};
