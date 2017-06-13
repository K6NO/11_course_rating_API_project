'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;


var CourseSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] // (Array of ObjectId values, _id values from the reviews collection)
});

CourseSchema.method('update', function (updates, callback) {
    Object.assign(this, updates);
    this.save(callback);
});

CourseSchema.pre('save', function (next) {
    // validation?
    next();
});

var Course = mongoose.model('Course', CourseSchema);
module.exports.Course = Course;
