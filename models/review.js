'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;


var ReviewSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postedOn: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        require: true,
        min: [1, 'Rate course from 1 to 5'],
        max: [5, 'Rate course from 1 to 5']
    },
    review: {
        type: String
    }
});

// pre-save validation not allowing users to rate own courses
ReviewSchema.pre("save", function (next) {
    //review = this;
    //Course.findOne({ reviews: review._id})
    //    .select('user reviews')
    //    .exec( function (err, course) {
    //        if (err) next(err)
    //        if (course) {
    //            if (review.user.toString() === course.user.toString()) {
    //                let err = new Error("Can not review own course")
    //                err.status = 503;
    //                return next(err);
    //            } else {
    //                next();
    //            }
    //        } else {
    //            next();
    //        }
    //    })
    next();
});

// Model
var Review = mongoose.model('Review', ReviewSchema);

module.exports.Review = Review;
