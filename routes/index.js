'use strict';
const express = require('express');
const router = express.Router();

// index
router.get('/', (req, res, next)=> {
   return res.send('Hello there');
});

// API routes

// GET /api/users - get users
router.get('/api/users', (req, res, next)=> {
   res.json({
      message: 'Users'
   })
});

// POST /api/users - create user
router.post('/api/users', (req, res, next)=> {
   res.json({
      message: req.body
   })
})

// GET /api/courses - get courses
router.get('/api/courses', (req, res, next)=> {
   res.json({
      message: 'Courses'
   })
});


// GET /api/course/:id - get single course
router.get('/api/courses/:id', (req, res, next)=> {
   res.json({
      message: req.params.id
   })
});

// POST /api/courses - create course
router.post('/api/courses', (req, res, next)=> {
   res.json({
      message: req.body
   })
});

// PUT /api/courses/:id - create course
router.put('/api/courses/:id', (req, res, next)=> {
   res.json({
      message: req.params.id
   })
});

// POST /api/courses/:id/reviews - create reviews
router.post('/api/courses/:id/reviews', (req, res, next)=> {
   res.json({
      message: req.params.id,
      rating: req.body.rating
   })
});


module.exports = router;