(function($){
    var canvas = oCanvas.create({ canvas: "#canvas", background: "#222" });

    var components = {
        cluster: [],
        cluster_node: []
    };
    var clusterClients = canvas.display.rectangle({
        x: 10,
        y: 10,
        width: 250,
        height: canvas.height-20,
        stroke: "inside 1px #FFF"
    });
    canvas.addChild(clusterClients);




    var clusterNodes = canvas.display.rectangle({
        x: 300,
        y: 10,
        width: 200,
        height: canvas.height-20,
        stroke: "inside 1px #FFF"
    });
    canvas.addChild(clusterNodes);


    function drawComponents(parent, components, color) {
        var padding = 3;
        var x = padding;
        var y = padding;
        var width = parent.width - 2*padding;
        var height = ((parent.height - padding) / components.length) - padding;
        console.log(color);
        components.forEach(function(component) {
            if (null == component.canvas) {
                var comp = canvas.display.rectangle({
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    fill: color,
                    opacity: 0
                });

                var text = canvas.display.text({
                    x: 10,
                    y: 10,
                    width: width,
                    origin: { x: "left", y: "center" },
                    align: "center",
                    font: "12px sans-serif",
                    text: component.name,
                    fill: "#fff",
                    opacity: 0

                });

                comp.addChild(text);
                parent.addChild(comp);

                comp.fadeIn();
                text.fadeIn();
                component.canvas = comp;
            } else {
                component.canvas.animate({
                    height: height,
                    y: y
                });
            }

            y += height + padding;
        });
    }
/*
    setInterval(function() {
        components.clusterClients.push({
            type: "cluster",
            name: Math.random()
        });
        drawComponents(clusterClients, components.clusterClients, '#7cbb6f');

    }, 5000);
*/

    var draw = function(type) {
        switch(type) {
            case 'cluster_node':
                drawClusterNodes();
                break;
            case 'cluster':
                drawClusterClients();
                break;
        }
    };

    var drawClusterNodes = _.debounce(function(){
        drawComponents(clusterNodes, components.cluster_node, '#97CF5A');
    }, 500);

    var drawClusterClients = _.debounce(function(){
        drawComponents(clusterClients, components.cluster, '#399BDA');
    }, 500);


    var socket = io.connect(window.location.origin);
    socket.on('init', function(data) {
        components = data;
        draw('cluster_node');
        draw('cluster');
    });
    socket.on('message', function (data) {
        console.log(data);
        var payload = data.data;
        switch(data.type) {
            case 'add':
                components[payload.type].push(payload);
                draw(payload.type);
                break;
            case 'remove':
                _.each(components[payload.type], function(component, index) {
                    if (component.name == payload.name) {
                        component.canvas.fadeOut("short", function(){
                            this.remove();
                            draw(payload.type);
                            components[payload.type].splice(index, 1);

                        })
                    }
                });
                break;
        }
    });



})(jQuery);