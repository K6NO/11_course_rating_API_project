'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;
var Course = require("./course").Course;


var ReviewSchema = new Schema({
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

 //Validator not allowing users to rate own courses
//ReviewSchema.method('checkUser', function (callback) {
//    this.parent().save(callback);
//});


// Model
var Review = mongoose.model('Review', ReviewSchema);

module.exports.Review = Review;
