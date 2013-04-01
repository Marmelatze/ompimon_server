/**
 * @author Lukas Schmitt <schmitt@w3p.cc>
 * Date: 31.03.13
 * Time: 18:02
 *
 */
var net = require('net');

var redis = require("redis");
var client = redis.createClient();

startServer();

function startServer() {
    var port = 8215;
    var server = net.createServer(function (c) { //'connection' listener
        console.log('server connected ');

        c.on('close', function () {
            console.log('server disconnected');
        });

        c.on('data', function(data){
            console.log('receive: ');
            console.log('data as buffer: ',data);
            data = data.toString('utf-8').trim();
            console.log('data as string: ', data);
            if(data == 'close'){
                server.close();
            }
        });

        /*client.set("test","Das ist ein Teststring");
        client.get("test", function(err, reply){
            c.write(reply);
        });*/

    });


    server.listen(port, function () { //'listening' listener
        console.log("Server started on port " + port);
    });

}