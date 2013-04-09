var eventEmitter = require('events').EventEmitter,
    http = require('http')
;


/**
 * Authentication class
 * @param type default: http. Can be one of http or test. Http authenticates against http backend.
 * @constructor
 */
function Auth(type) {
    eventEmitter.call(this);
    this.type = type || 'http';
}

// inherit events.EventEmitter
Auth.super_ = eventEmitter;
Auth.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Auth,
        enumerable: false
    }
});

/**
 * Authenticate a user
 * @param user
 * @param password
 * @param callback will be called if authentication is successfull
 * @param errorCallback will be called if authentication failed
 */
Auth.prototype.authenticate= function(user, password, callback, errorCallback) {
    switch (this.type) {
        case 'http':
            this.authenticateHTTP(user, password, callback, errorCallback);
            break;
        case 'test':
            this.authenticateTest(user, password, callback, errorCallback);
            break;
    }
};

/**
 * Authenticate a user against the http backend
 * @param user
 * @param password
 * @param callback
 * @param errorCallback
 * @returns {*}
 */
Auth.prototype.authenticateHTTP = function(user, password, callback, errorCallback) {
    var self = this;
    http.get({
        hostname: "localhost",
        port: 3000,
        path: "/auth/" + user + "/" + password,
        agent: false // with true connections dies after a few tries
    }, function(res) {
        if (200 == res.statusCode) {
            callback();
        } else {
            errorCallback();
        }
    }).on('error', function(e) {
        console.log(e);
        errorCallback();
    });

    return this;
};

/**
 * Dummy authentication function used for unit testing
 * @param user
 * @param password
 * @param callback
 * @param errorCallback
 */
Auth.prototype.authenticateTest = function(user, password, callback, errorCallback) {
    if (user == "test" && password == "test") {
        callback();
    } else {
        errorCallback();
    }
};

exports.auth = new Auth();
