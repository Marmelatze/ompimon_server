/**
 * Module dependencies.
 */

var express = require('express'),
    cons = require('consolidate'),
    swig = require('swig'),
    orm = require('orm'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require("./config").config;

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.engine('.html', cons.swig);
    app.set('view engine', 'html');
    app.use(express.favicon());
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


// set up db
var db = config.db;
orm.connect("mysql://" + db.user + ":" + db.password + "@" + db.host + ":" + db.port + "/" + db.name, function (err, db) {
    console.log("connected to db");
});

/*
app.use(orm.express("mysql://" + db.user + ":" + db.password + "@" + db.host + ":" + db.port + "/" + db.name, {
    define: function (db, models) {
        db.load("./models", function (err) {
            var User = db.models.user;
        });
        console.log("Synchronizing database schema");
        db.sync();
    }
}));
*/

app.get('/', routes.index);
app.get('/users', user.list);
app.all('/users/add', user.add);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
