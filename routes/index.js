'use strict';
const express = require('express');
const router = express.Router();

var User = require('../models/user').User;
var Review = require('../models/review').Review;
var Course = require('../models/course').Course;

// Auth middleware
var mid = require('../middleware/index');


// index
router.get('/', (req, res, next)=> {
    return res.send('Hello there');
});


// API routes

// GET /api/users - get users
router.get('/api/users', mid.isAuthenticated, (req, res, next)=> {
    User.find({})
        .sort({fullName: 1})
        .exec(function(err, users){
            if (err) return next(err);
            return res.json(users);
        })
});

// POST /api/users - create user
router.post('/api/users', (req, res, next)=> {
    var user = new User(req.body);
    user.save(function (err) {
        if (err) {
            //err.status = 400;
            return next(err);
        }
        // indicate to the client that the doc saved successfully
        res.setHeader('Location', '/');
        res.status(201);
        res.json({});
    })
});

// GET /api/courses - get courses
router.get('/api/courses', (req, res, next)=> {
    Course.find({})
        .select('_id title')
        .sort({title: 1})
        .exec(function(err, courses){
            if (err) return next(err);
            return res.json(courses);
        })
});


// GET /api/course/:id - get single course
router.get('/api/courses/:id', (req, res, next)=> {
    Course.findById(req.params.id)
        .populate('user', 'fullName')
        .populate('reviews')
        .exec(function (err, course) {
            if (err) return next(err);
            if(!course){
                var noCourseErr = new Error('Not Found');
                noCourseErr.status = 404;
                return next(noCourseErr);
            }
            res.status(200).json(course);
        });
});

// POST /api/courses - create course
router.post('/api/courses', mid.isAuthenticated ,(req, res, next)=> {
    var course = new Course(req.body);
    course.save(function (err) {
        if (err) {
            err.status = 400;
            return next(err);
        }
        res.status(201); // indicate to the client that the doc saved successfully
        res.header('Location', '/');
        res.json({});
    })
});

// PUT /api/courses/:id - create course
router.put('/api/courses/:id', mid.isAuthenticated, (req, res, next)=> {
    Course.findById(req.params.id)
        .exec(function (err, course) {
            if (err) return next(err);
            if(!course) return next(err);
            course.update(req.body, function (err) {
                if (err) {
                    err.status = 400;
                    return next(err);
                }
                res.status(201); // indicate to the client that the doc saved successfully
                res.header('Location', '/');
                res.json({});
            })
        })
});

// POST /api/courses/:id/reviews - create reviews
router.post('/api/courses/:id/reviews', mid.isAuthenticated, (req, res, next)=> {
    Course.findById(req.params.id)
        .exec(function (err, course) {
            if (err) return next(err);
            if(!course) return next(err);

            let review = new Review(req.body);
            //review.checkUser(function(err) {
                if (err) return next(err);
                review.save(function (err, review) {
                    if (err) return next(err);
                    course.reviews.push(review);
                    course.save(function (err) {
                        if (err) return next(err);
                        res.status(201); // indicate to the client that the doc saved successfully
                        res.header('Location', '/');
                        res.json({});
                    });
                });
            //})
        });
});


module.exports = router;