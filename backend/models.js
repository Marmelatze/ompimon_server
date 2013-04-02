module.exports = function(schema) {
    var user = schema.define('user', {
        name: {type: String, index: true},
        password: String,
        salt: String,
        type: String
    });
    user.validatesPresenceOf('name', 'type');
    user.validatesInclusionOf('type', {in: ['cluster', 'android']});

    user.validatesUniquenessOf('name', {message: 'name is not unique'});

};