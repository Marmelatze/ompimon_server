(function($){
    var canvas = oCanvas.create({ canvas: "#canvas", background: "#222" });

    var components = {
        clusterClients: [
            {
                type: "cluster",
                name: "29412jadsfbasfd"
            }
        ],
        clusterNodes: [
            {
                type: "node_cluster",
                name: 456
            },
            {
                type: "node_cluster",
                name: 123
            }
        ]

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

    drawComponents(clusterClients, components.clusterClients, '#7cbb6f');

    function drawComponents(parent, components, color) {
        var padding = 3;
        var x = padding;
        var y = padding;
        var width = parent.width - 2*padding;
        var height = ((parent.height - padding) / components.length) - padding;
        components.forEach(function(component) {
            if (null == component.canvas) {
                var client = canvas.display.rectangle({
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

                client.addChild(text);
                parent.addChild(client);

                client.fadeIn();
                text.fadeIn();
                component.canvas = client;
            } else {
                component.canvas.animate({
                    height: height,
                    y: y
                });
            }

            y += height + padding;
        });
    }

    setInterval(function() {
        components.clusterClients.push({
            type: "cluster",
            name: Math.random()
        });
        drawComponents(clusterClients, components.clusterClients, '#7cbb6f');

    }, 5000);



})(jQuery);