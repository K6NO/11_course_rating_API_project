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
    console.log(req.session.userId);
    User.findOne({_id: req.session.userId})
        .exec(function(err, user){
            console.log(user);
            if (err) return next(err);
            return res.json(user);
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
// Uses deep population to return fullName of users posting reviews
router.get('/api/courses/:id', (req, res, next)=> {
    Course.findById(req.params.id)
        .populate('user', 'fullName')
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                model: 'User',
                select: 'fullName'
            }
        })
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

// PUT /api/courses/:id - update course
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

            // CHECK/VALIDATE if user rates his own course
            let courseUserId = course.user;
            let signedInUserId = req.session.userId;
            if(courseUserId.toString() == signedInUserId.toString()) {
                let sameUserErr = new Error('Cannot review own course');
                sameUserErr.status = 401;
                return next(sameUserErr);
            }

            let review = new Review(req.body);
                if (err) return next(err);
                review.save(function (err, review) {
                    if (err) return next(err);
                    course.reviews.push(review);
                    course.save(function (err) {
                        if (err) return next(err);
                        res.status(201); // doc saved successfully
                        res.header('Location', '/');
                        res.json({});
                    });
                });
        });
});

module.exports = router;