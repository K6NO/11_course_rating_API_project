'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var ReviewSchema = require('./review').ReviewSchema;


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
            ref: 'ReviewSchema'
        }]
});

CourseSchema.method('update', function (updates, callback) {
    Object.assign(this, updates);
    this.save(callback);
});

var Course = mongoose.model('Course', CourseSchema);
module.exports.Course = Course;
module.exports.CourseSchema = CourseSchema;

