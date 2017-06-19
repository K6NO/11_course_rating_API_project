'use strict';
const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema;


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

// Validation is done at the route: // POST /api/courses/:id/reviews

// Model
var Review = mongoose.model('Review', ReviewSchema);

module.exports.Review = Review;
