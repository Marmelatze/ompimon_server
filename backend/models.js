module.exports = function (db, cb) {
    db.define('user', {
        name : String,
        password: String,
        type: ['cluster', 'android']
    });

    return cb();
};