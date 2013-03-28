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
    res.render("user/add");
};