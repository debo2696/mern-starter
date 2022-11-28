const express = require('express'); //Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
const logger = require('morgan'); //HTTP request logger middleware for node.js
const movies = require('./Routes/movie') ;
const users = require('./Routes/user');
const bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.bodyproperty
const mongoose = require('./config/database'); //database configuration

var jwt = require('jsonwebtoken');
const app = express();

app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false })); //Converting response to Json


app.get('/', function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});


function validateUser(req, res, next) { //User needs to be validated to access Movie
    // console.log('tok: '+req.headers['x-access-token']);
    // process.exit();
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

// public route
app.use('/users', users);
// private route
app.use('/movies', validateUser, movies);


app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});


// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "Something looks wrong :( !!!" });
});

app.listen(3000, function () { console.log('Node server listening on port 3000'); });