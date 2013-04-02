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
        user.isValid(function(valid) {
            if (valid) {
                user.save(function(err) {
                    res.redirect("/users");
                });
            } else {
                res.render("user/edit", {
                    user: req.user,
                    errors: user.errors
                });
            }
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

exports.authenticate = function(req, res) {
    var username = req.params.user;
    var password = req.params.password;

    req.models.user.findOne({where: {name: username}}, function(err, user) {
        if (!user) {
            res.send(401);

            return;
        }

        if (user.password == generatePassword(user.salt, password)) {
            res.send(200);

            return;
        }

        res.send(401);
    });
};

var generatePassword = exports.generatePassword = function(salt, password) {
    return crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('hex') + salt).digest('hex');
};


function generateSalt() {
    return crypto.randomBytes(256);
}
