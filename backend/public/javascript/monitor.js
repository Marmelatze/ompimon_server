function Monitor() {
    this.init.call(this, arguments);
};

_.extend(Monitor.prototype, {

    colors: {
        0x00: '#66747B',
        0x01: '#DE6314',
        0x02: '#003366',
        0x03: '#996600',
        0x04: '#729FCF',
        0x05: '#64f0ff',
        0x07: '#7259ff',
        0xA0: '#ff3815',
        0xA1: '#a5ff16',
        0xFF: '#FFFFFF'
    },

    init: function() {
        this.recording = false;
        this.historyPosition = 0;
        var comparator = function(a, b) {
            var res = a.data.time - b.data.time;
            if (0 != res) {
                return res;
            }

            return a.data.counter - b.data.counter;
        };
        this.history = [];
        this.messageQueue = new Heap(comparator);
        this.delay = 250;
        this.messageDrawing = false;
        this.canvas = oCanvas.create({ canvas: "#canvas", background: "#222" });

        this.components = {
            cluster: [],
            cluster_node: [],
            client_node: [],
            client: [],
            db: [{
                type: 'db',
                name: 'Redis'
            }]
        };
        this.componentsMap = {};
        this.clusterClients = this.canvas.display.rectangle({
            x: 10,
            y: 30,
            width: 250,
            height: canvas.height-40,
            stroke: "inside 1px #FFF"
        });
        this.canvas.addChild(this.clusterClients);


        this.clusterNodes = this.canvas.display.rectangle({
            x: 300,
            y: 30,
            width: 150,
            height: 350,
            stroke: "inside 1px #FFF"
        });
        this.canvas.addChild(this.clusterNodes);

        this.clientNodes = this.canvas.display.rectangle({
            x: 480,
            y: 30,
            width: 150,
            height: 350,
            stroke: "inside 1px #FFF"
        });
        this.canvas.addChild(this.clientNodes);


        this.clients = this.canvas.display.rectangle({
            x: 670,
            y: 30,
            width: 250,
            height: canvas.height-40,
            stroke: "inside 1px #FFF"
        });
        this.canvas.addChild(this.clients);


        this.canvas.addChild(this.canvas.display.rectangle({
            x: 295,
            y: 5,
            width: 340,
            height: canvas.height - 10,
            stroke: "inside 1px #FFF"
        }));

        this.dbs = this.canvas.display.rectangle({
            x: 300,
            y: 390,
            width: 330,
            height: 100,
            stroke: "inside 1px #FFF"
        });
        this.canvas.addChild(this.dbs);


        // text

        this.canvas.addChild(this.canvas.display.text({
            x: 10,
            y: 10,
            origin: { x: "left", y: "center" },
            align: "center",
            font: "12px sans-serif",
            text: "Cluster",
            fill: "#fff"
        }));
        this.canvas.addChild(this.canvas.display.text({
            x: 300,
            y: 15,
            origin: { x: "left", y: "center" },
            align: "center",
            font: "12px sans-serif",
            text: "Cluster Server",
            fill: "#fff"
        }));
        this.canvas.addChild(this.canvas.display.text({
            x: 480,
            y: 15,
            origin: { x: "left", y: "center" },
            align: "center",
            font: "12px sans-serif",
            text: "Client Server",
            fill: "#fff"
        }));

        this.canvas.addChild(this.canvas.display.text({
            x: 670,
            y: 10,
            origin: { x: "left", y: "center" },
            align: "center",
            font: "12px sans-serif",
            text: "Clients",
            fill: "#fff"
        }));

        this.listen();
    },
    drawComponents: function(parent, components, color, fontColor) {
        var padding = 3;
        var x = padding;
        var y = padding;
        var width = parent.width - 2*padding;
        var height = ((parent.height - padding) / components.length) - padding;
        components.forEach(function(component) {
            if (null == component.canvas) {
                var comp = this.canvas.display.rectangle({
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fill: color,
                    opacity: 0
                });

                var text = this.canvas.display.text({
                    x: 10,
                    y: 10,
                    width: width,
                    origin: { x: "left", y: "center" },
                    align: "center",
                    font: "12px sans-serif",
                    text: component.name,
                    fill: fontColor || "#fff",
                    opacity: 0
                });

                comp.addChild(text);
                parent.addChild(comp);

                comp.fadeIn();
                text.fadeIn();
                component.canvas = comp;
                this.componentsMap[component.type+":"+component.name] = component;
            } else {
                component.canvas.animate({
                    height: height,
                    y: y
                });
            }

            y += height + padding;
        }, this);
    },
    draw: function(type, callback) {

        switch(type) {
            case 'cluster_node':
                this.drawClusterNodes();
                break;
            case 'cluster':
                this.drawClusterClients();
                break;
            case 'client_node':
                this.drawClientNodes();
                break;
            case 'client':
                this.drawClients();
                break;
            case 'db':
                this.drawDB();
                break;
        }
        if (callback) {
            setTimeout(callback, 500);
        }
    },
    drawClusterNodes: _.debounce(function(){
        this.drawComponents(this.clusterNodes, this.components.cluster_node, '#97CF5A');
    }, 500),

    drawClusterClients: _.debounce(function(){
        this.drawComponents(this.clusterClients, this.components.cluster, '#399BDA');
    }, 500),

    drawClientNodes: _.debounce(function(){
        this.drawComponents(this.clientNodes, this.components.client_node, '#DE6314');
    }, 500),

    drawClients: _.debounce(function(){
        this.drawComponents(this.clients, this.components.client, '#00BBBB');
    }, 500),
    drawDB: _.debounce(function(){
        this.drawComponents(this.dbs, this.components.db, '#FECC22', '#000');
    }, 500),



    listen: function() {
        var socket = io.connect(window.location.origin);
        socket.on('init', function(data) {
            data.db = [
                {
                    type: 'db',
                    name: 'Redis'
                }
            ];
            this.components = data;
            this.draw('cluster_node');
            this.draw('cluster');
            this.draw('client_node');
            this.draw('client');
            this.draw('db');
        }.bind(this));
        socket.on('message', function (data) {
            if (this.recording) {
                if (this.history.length > 1000) {
                    return;
                }
                this.history.push(data);
                this.updateHistoryStatus();
            } else {
                this.messageQueue.push(data);
            }
        }.bind(this));

        setInterval(function() {
            if (!this.recording) {
                this.drawMessages();
            }
        }.bind(this), 500);

    },
    handleMessage: function(data, callback) {
        var self = this;
        var payload = data.data;
        switch(data.type) {
            case 'add':
                this.components[payload.type].push(payload);
                this.draw(payload.type, callback);
                break;
            case 'remove':
                _.each(this.components[payload.type], function(component, index) {
                    if (component.name == payload.name) {
                        component.canvas.fadeOut("short", function(){
                            this.remove();
                            self.draw(payload.type, callback);
                            self.components[payload.type].splice(index, 1);

                        });
                    }
                }, this);
                break;
            case 'message':
                this.drawMessage(payload, callback);
                break;
        }
    },

    getById: function(id) {
        if (id == "db") {
            id = "db:Redis";
        }
        return this.componentsMap[id];
    },

    drawMessages: function() {
        if (this.messageDrawing) {
            return false;
        }

        this.messageDrawing = true;

        console.log(this.messageQueue.toArray());

        async.whilst(
            function() {
                return !this.messageQueue.empty();
            }.bind(this),
            function (callback) {
                var message = this.messageQueue.pop();
                console.log(message.data.from, message.data.to, message.data.time, message.data.counter);
                this.handleMessage(message, callback);
            }.bind(this),
            function (err) {
                this.messageDrawing = false;
            }.bind(this)
        )
    },

    drawMessage: function(message, callback, force) {
        var from = this.getById(message.from);
        var to = this.getById(message.to);

        if (from == null || to == null) {
            if (!force) {
                setTimeout(function() {
                    this.drawMessage(message, callback, true);
                }.bind(this), 500);
            }


            return;
        }

        if (null == from.count) {
            from.count = 0;
        }
        if (null == to.count) {
            to.count = 0;
        }

        from.count++;
        to.count++;

        var start = {
            x: from.canvas.abs_x + from.canvas.width/2 + 5,
            y: from.canvas.abs_y + 10
        };

        var end = {
            x: to.canvas.abs_x + to.canvas.width/2 - 5,
            y: to.canvas.abs_y + 10
        };

        var size = 5 + message.size/50;

        var padding = size+10;
        if (start.y + from.count*padding > from.canvas.abs_y + from.canvas.height -10) {
            from.count = 0;
        }
        start.y += from.count * padding;

        if (end.y + to.count*padding > to.canvas.abs_y + to.canvas.height - 10) {
            to.count = 0;
        }
        end.y += to.count * padding;

        color = this.colors[message.action] || '#BB00BB';


        var line = this.canvas.display.line({
            start: start,
            end: start,
            stroke: size+"px "+color,
            shadow: '0 0 3px #000',
            cap: "round"
        });
        this.canvas.addChild(line);
        line.animate({
            end: end
        }, {
            duration: 200
        /*   callback: callback*/
        });
        if (!this.recording) {
            if (this.delay == 0) {
                callback();
            } else {
                setTimeout(function() {
                    callback();
                }, this.delay);
            }
        }

        setTimeout(function() {
            line.fadeOut();
        }, 1000);
    },

    startRecording: function() {
        this.recording = true;
        this.history = [];
        this.historyPosition = 0;

        this.historyStatus = $('<input type="text">');
        $('#recording').parent().append(this.historyStatus);
        this.updateHistoryStatus();
    },
    goForward: function() {
        if (this.historyPosition>=this.history.length) {
            return;
        }
        var message = this.history[this.historyPosition];
        this.historyPosition++;
        this.updateHistoryStatus();
        this.handleMessage(message);
    },
    goBack: function() {
        if (this.historyPosition<=0) {
            return;
        }
        this.historyPosition--;
        var message = this.history[this.historyPosition];
        this.updateHistoryStatus();
        this.handleMessage(message);
    },
    updateHistoryStatus: function() {
        this.historyStatus.val(this.historyPosition+"/"+this.history.length);
    },

    random: function (min, max) {
        return Math.random() * (max - min) + min;
    }
});





(function($){
    var monitor = new Monitor();

    $('#delay-minus').click(function(event) {
        event.preventDefault();
        monitor.delay -= 100;
        $('#delay').val(monitor.delay);
    });
    $('#delay-plus').click(function(event) {
        event.preventDefault();
        monitor.delay += 100;
        $('#delay').val(monitor.delay);
    });

    $('#delay').change(function() {
        monitor.delay = $(this).val();
    });

    var legend = $('#legend');
    _.each(monitor.colors, function(color, action) {
        var row = $('<tr></tr>');
        var colorCol = $('<td></td>').css({backgroundColor: color});
        var text = $('<td></td>').html(action);
        row.append(colorCol).append(text);
        legend.append(row);
    });

    $('#recording').click(function(event) {
        event.preventDefault();
        monitor.startRecording();
        $(this).html("Stop recording");

        $(window).keydown(function(event) {
            if (event.keyCode == 37) {
                monitor.goBack();
            }
            if (event.keyCode == 39) {
                monitor.goForward();
            }
        });


    });



})(jQuery);