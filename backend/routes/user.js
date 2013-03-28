/*
 * GET users listing.
 */

exports.list = function (req, res) {
    req.models.user.find({}, function(err, users) {


        res.render('user/list', {users: users});
    });

};

exports.add = function (req, res) {
    if ("POST" == req.method) {
        req.models.user.create([{
            name: req.body.name,
            password: req.body.password,
            type: req.body.type
        }], function(err, items) {
            if (!err) {
            }
        });

        return res.redirect("/users");
    }
    res.render("user/edit", {
        user: {}
    });
};

exports.load = function (req, res, next) {
    if (req.params.user) {
        req.models.user.get(req.params.user, function(err, user) {
            req.user = user;
            next();
        });
    }
};

exports.edit = function (req, res) {
    if ("POST" == req.method) {
        req.user.name = req.body.name;
        if (req.body.password.length > 0) {
            req.user.password = req.body.password;
        }
        req.user.type = req.body.type;

        req.user.save(function(err) {

        });

        return res.redirect("/users");
    }
    res.render("user/edit", {
        user: req.user
    });
};

exports.delete = function(req, res) {
    req.user.remove();

    res.redirect("/users");
};