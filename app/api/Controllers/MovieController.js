const movieModel = require('../../../Models/Movie');
const mongoose = require('../../../config/database'); //database configuration
module.exports = {

    getById: function (req, res, next) {
        // console.log(req.body);
        movieModel.findById(req.params.movieId, function (err, movieInfo) {
            if (err) {
                next(err);
            } else {
                res.json({ status: "success", message: "Movie found!!!", data: { movies: movieInfo } });
            }
        });
    },

    getAll: function (req, res, next) {
        let moviesList = [];
        // var a = await movieModel.findOne({'_id':'6384a83c9d201c1d8e79996e'});
        // var a = movieModel.findOne({'_id':mongoose.Types.ObjectId('6384a83c9d201c1d8e79996e')});
        movieModel.find({}, function (err, movies) {
            if (err) {
                next(err);
            } else {
                // const array1 = ['a', 'b', 'c'];
                // array1.forEach(element => console.log(element));
                for (let movie of movies) {
                    moviesList.push({ id: movie._id, name: movie.name, released_on: movie.released_on });
                }
                res.json({ status: "success", message: "Movies list found!!!", data: { movies: moviesList } });

            }
        });
    },

    updateById: function (req, res, next) {
        movieModel.findByIdAndUpdate(req.params.movieId, { name: req.body.name }, function (err, movieInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "Movie updated successfully!!!", data: null });
            }
        });
    },
    deleteById: function (req, res, next) {
        movieModel.findByIdAndRemove(req.params.movieId, function (err, movieInfo) {
            if (err)
                next(err);
            else {
                res.json({ status: "success", message: "Movie deleted successfully!!!", data: null });
            }
        });
    },
    create: function (req, res, next) {
        movieModel.create({ name: req.body.name, released_on: req.body.released_on }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "Movie added successfully!!!", data: null });

        });
    },
}