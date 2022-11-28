const userModel = require('../../../Models/User');
const bcrypt = require('bcrypt'); //hash your plain password and store hashed password in database
const jwt = require('jsonwebtoken'); //JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.
const { json } = require('body-parser');

module.exports = {
    create: function (req, res, next) 
    {
        // res.json({'status':req});
        // process.exit();
        userModel.create(
            { 
                name: req.body.name, 
                email: req.body.email, 
                password: req.body.password 
            }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "User created successfully!!!", data: null });
        });
    },

    authenticate: function (req, res, next) 
    {
        userModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
                } else {
                    res.json({ status: "error", message: "Invalid email/password!!!", data: null });
                }
            }
        });
    },
}