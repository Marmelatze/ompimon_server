/*
 * GET users listing.
 */

var crypto = require("crypto");

exports.list = function (req, res) {
    req.models.user.all(function(err, users) {
        res.render('user/list', {users: users});
    });
};

exports.add = function (req, res) {
    if ("POST" == req.method) {
        req.models.user.create({
            salt: generateSalt(),
            name: req.body.name,
            password: generatePassword(this.salt, req.body.password),
            type: req.body.type
        });

        res.redirect("/users");

        return;
    }
    res.render("user/edit", {
        user: {}
    });
};

exports.load = function (req, res, next) {
    if (req.params.user) {
        req.models.user.find(req.params.user, function(err, user) {
            req.user = user;
            next();
        });
    }
};

exports.edit = function (req, res) {
    if ("POST" == req.method) {
        var user = req.user;
        user.name = req.body.name;
        if (req.body.password.length > 0) {
            user.salt = generateSalt();
            user.password = generatePassword(user.salt, req.body.password);
        }
        user.type = req.body.type;

        user.save(function(err) {
            res.redirect("/users");
        });

        return;
    }
    res.render("user/edit", {
        user: req.user
    });
};

exports.delete = function(req, res) {
    req.user.destroy();

    res.redirect("/users");
};

var generatePassword = exports.generatePassword = function(salt, password) {
    return crypto.createHash('sha512').update(crypto.createHash('sha512').update(password + salt).digest('hex') + salt).digest('hex');
};


function generateSalt() {
    return crypto.randomBytes(256);
}
