var eventEmitter = require('events').EventEmitter,
    http = require('http')
;




function Auth() {
    eventEmitter.call(this);
}

// inherit events.EventEmitter
Auth.super_ = eventEmitter;
Auth.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Auth,
        enumerable: false
    }
});

Auth.prototype.authenticate = function(user, password, callback, errorCallback) {
    var self = this;
    http.get("http://localhost:3000/auth/" + user + "/" + password, function(res) {
        if (200 == res.statusCode) {
            callback();
        } else {
            errorCallback();
        }
    }).on('error', function(e) {
        errorCallback();
    });

    return this;
};

exports.auth = new Auth();
