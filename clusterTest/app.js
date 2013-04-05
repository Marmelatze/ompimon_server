/**
 * @author Lukas Schmitt <schmitt@w3p.cc>
 * Date: 03.04.13
 * Time: 09:28
 *
 */
var net = require('net');
var client = net.connect({port: 8214}, function() { //'connect' listener
        console.log('client connected');

        auth();

        /*buf = new Buffer(9);
        len = buf.write('1 + 2 = 3', 0);
        console.log(len + " bytes: " + buf.toString('utf8', 0, len));
        client.write(buf);*/
    });
client.on('data', function(data) {
    console.log("received:");
    console.log(data);
    console.log(data.toString('utf8'));
});
client.on('end', function() {
    console.log('client disconnected');
});

function auth(){
    var username = 'test';
    var password = 'install';
    var buf = new Buffer(256);
    var len = 0;
    buf.writeUInt8('0', 0);
    len++;
    buf.writeUInt8(username.length, len);
    len++;
    len += buf.write(username, len);
    buf.writeUInt8(password.length, len);
    len++;
    len += buf.write(password, len);

    finBuf = buf.slice(0,len);
    client.write(finBuf);
}