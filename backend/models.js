module.exports = function(schema) {
    var user = schema.define('user', {
        name: {type: String, index: true},
        password: String,
        salt: String,
        types: {type: Array, default: []}
    });


    user.validatesPresenceOf('name', 'types');

    user.validatesUniquenessOf('name', {message: 'name is not unique'});

};