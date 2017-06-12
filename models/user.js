'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

var CourseSchema = new mongoose.Schema({
    user: [UserSchema],
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    estimatedTime: {
        type: String
    },
    materialsNeeded: {
        type: String
    },
    steps: [
        {
            stepNumber: Number
        },
        {
            title: {
                type: String,
                required: true,
                trim: true
            }
        }, {
            description: {
                type: String,
                required: true,
                trim: true
            }
        }],
    reviews: [], // (Array of ObjectId values, _id values from the reviews collection)
});

var ReviewSchema = new mongoose.Schema({
    user: [UserSchema],
    postedOn: {
        type: Date,
        default: Date.now()
    },
    rating: {
        type: Number,
        min: [1, 'Rate course from 1 to 5'],
        max: [5, 'Rate course from 1 to 5']
    },
    review: {
        type: String
    }
});

var User = mongoose.model('User', UserSchema);
var Course = mongoose.model('Course', CourseSchema);
var Review = mongoose.model('Review', ReviewSchema);


module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;