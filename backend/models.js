module.exports = function(schema) {
    var user = schema.define('user', {
        name: {type: String, index: true},
        password: String,
        salt: String,
        types: String
    });

    user.prototype.getTypes = function() {
        return this.types.split(",");
    };
    user.prototype.setTypes = function(types) {
        this.types = 
    }

    user.validatesPresenceOf('name', 'type');
    user.validatesInclusionOf('type', {in: ['cluster', 'android']});

    user.validatesUniquenessOf('name', {message: 'name is not unique'});

};