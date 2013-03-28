module.exports = function(schema) {
    var user = schema.define('user', {
        name: String,
        password: String,
        salt: String,
        type: String
    });
};