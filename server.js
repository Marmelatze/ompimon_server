var net = require('net');

var port = 8214;
var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.listen(port, function() { //'listening' listener
  console.log("Server started on port " + port);
});

// this is a comment
