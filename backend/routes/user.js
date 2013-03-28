/*
 * GET users listing.
 */

exports.list = function (req, res) {
    res.render('user/list', {users: []});
};

exports.add = function (req, res) {
    console.log(req.method);
    res.render("user/add");
};