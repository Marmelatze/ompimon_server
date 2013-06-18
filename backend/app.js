/**
 * Module dependencies.
 *
 * @module ompimon
 * @submodule ompimon-backend
 * @author Florian Pfitzer<pfitzer@w3p.cc>
 */

var express = require('express'),
    cons = require('consolidate'),
    swig = require('swig'),
    routes = require('./routes'),
    user = require('./routes/user'),
    monitor = require('./routes/monitor'),
    http = require('http'),
    path = require('path'),
    Schema = require("jugglingdb").Schema,
    io = require("socket.io"),
    redis = require("redis").createClient(),
    _ = require("underscore")
;


var app = express();

// set up db
var schema = new Schema('redis', {port: 6379});
require('./models')(schema);

console.log("Updating DB Schema");
schema.autoupdate();


app.use(function(req, res, next) {
    req.schema = schema;
    req.models = schema.models;
    next();
});



app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.engine('.html', cons.swig);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

swig.init({
    root: __dirname + '/views',
    allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
});




app.get('/', routes.index);
app.get('/users', user.list);
app.all('/users/add', user.add);
app.all('/users/:user/edit', user.load, user.edit);
app.get('/users/:user/delete', user.load, user.delete);
app.get('/auth/:type/:user/:password', user.authenticate);

app.get('/monitor', monitor.index);

var server = http.createServer(app);
io = io.listen(server);
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

redis.subscribe('monitor');
var components = {
    cluster: [],
    cluster_node: [],
    client_node: [],
    client: []
};
io.sockets.on('connection', function (socket) {
    socket.emit('init', components);
});

redis.on('message', function(channel, message) {
    message = JSON.parse(message);
    var payload = message.data;
    var array = components[payload.type];
    if (message.type == 'add') {
        if (_.where(array, {name: payload.name}).length > 0) {
            return;
        }
        components[payload.type].push(payload);
    }
    if (message.type == 'remove') {
        _.each(array, function(value, index) {
            if (value.name == payload.name) {
                array.splice(index, 1);
            }
        });
    }

    io.sockets.emit('message', message);
});