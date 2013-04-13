/*
 * GET users listing.
 */

var crypto = require("crypto"),
    _ = require('underscore');

/**
 * List all users
 * @param req
 * @param res
 */
exports.list = function (req, res) {
    req.models.user.all(function(err, users) {
        console.log(_.indexOf(users[0]['types'], 'cluster'));

        res.render('user/list', {users: users});
    });
};

/**
 * Create new users
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    if ("POST" == req.method) {
        req.models.user.create({
            salt: generateSalt(),
            name: req.body.name,
            password: generatePassword(this.salt, req.body.password),
            types: req.body.types
        });

        res.redirect("/users");

        return;
    }
    res.render("user/edit", {
        user: {}
    });
};

/**
 * middleware for loading users
 * @param req
 * @param res
 * @param next
 */
exports.load = function (req, res, next) {
    if (req.params.user) {
        req.models.user.find(req.params.user, function(err, user) {
            req.user = user;
            next();
        });
    }
};

/**
 * edit users
 * @param req
 * @param res
 */
exports.edit = function (req, res) {
    if ("POST" == req.method) {
        var user = req.user;
        user.name = req.body.name;
        if (req.body.password.length > 0) {
            user.salt = generateSalt();
            user.password = generatePassword(user.salt, req.body.password);
        }
        user.types = req.body.types;
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

/**
 * delete users
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    req.user.destroy();

    res.redirect("/users");
};

/**
 * Authenticate api
 * Returns HTTP Status 200 if successfull or 401 if failed
 * @param req
 * @param res
 */
exports.authenticate = function(req, res) {
    var type = req.type;
    var username = req.params.user;
    var password = req.params.password;

    req.models.user.findOne({where: {name: username}}, function(err, user) {
        console.log(user.types.indexOf('cluster'));
        if (!user) {
            res.send(401, "Failed");

            return;
        }

        if (user.types.indexOf(type) < 0) {
            res.send(402, "Failed");

            return;
        }

        if (user.password == generatePassword(user.salt, password)) {
            res.send(200, "Ok");

            return;
        }

        res.send(401, "Failed");
    });
};

var generatePassword = exports.generatePassword = function(salt, password) {
    return crypto.createHash('sha512').update(crypto.createHash('sha512').update(password).digest('hex') + salt).digest('hex');
};


function generateSalt() {
    return crypto.randomBytes(256);
}
