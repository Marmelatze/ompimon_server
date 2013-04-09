var eventEmitter = require('events').EventEmitter
    ;


exports.Action = Action;

function Action () {
    eventEmitter.call(this);
}

// inherit events.EventEmitter
Action.super_ = eventEmitter;
Action.prototype = Object.create(eventEmitter.prototype, {
    constructor: {
        value: Action,
        enumerable: false
    }
});
