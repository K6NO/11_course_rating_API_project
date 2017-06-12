'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    emailAddress: {
        type: String,
        unique: true,
        required: [true, 'Provide an email address.'],
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'The email you provided is not a valid.'
        },
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
    reviews: [ReviewSchema.Types.ObjectId] // (Array of ObjectId values, _id values from the reviews collection)
});

// Models
var User = mongoose.model('User', UserSchema);
var Course = mongoose.model('Course', CourseSchema);
var Review = mongoose.model('Review', ReviewSchema);

// Validators

// TODO user email validator --> move to separate module
var badUser = new User({
    emailAddress: undefined,
    fullName: 'Tamas Kenessey',
    password: 12345
});

var error = badUser.validateSync();
assert.equal(error.errors['email'].message,
    'Provide an email address.');

badUser.emailAddress = 'ttttttt';

error = badUser.validateSync();
assert.equal(error.errors['email'].message,
    'ttttttt is not a valid email address');

badUser.emailAddress = 'tktk@gmail';

error = badUser.validateSync();
assert.equal(error.errors['email'].message,
    'tktk@gmail is not a valid email address');

badUser.emailAddress = 'tktk@gmail.com.';

error = badUser.validateSync();
assert.equal(error.errors['email'].message,
    'tktk@gmail.com. is not a valid email address');

badUser.emailAddress = 'tktk@gmail.com';
// Validation succeeds! Email is defined and fulfills regex criteria
error = user.validateSync();
assert.equal(error, null);

module.exports.User = User;
module.exports.Course = Course;
module.exports.Review = Review;