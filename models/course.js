'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

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
            ref: 'Review',
            unique: true
        }]
});

CourseSchema.plugin(uniqueValidator);

CourseSchema.method('update', function (updates, callback) {
    Object.assign(this, updates);
    this.save(callback);
});

var Course = mongoose.model('Course', CourseSchema);

module.exports.Course = Course;
