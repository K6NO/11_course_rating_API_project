'use strict';

// load modules
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var seeder = require('mongoose-seeder'),
    data = require('./data/data.json');

var app = express();

// Models

var User = require('../models/user');
var Review = require('../models/review');
var Course = require('../models/course');

// set our port
app.set('port', process.env.PORT || 5000);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/courserating");
var db = mongoose.connection;

// error / connection logs
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log('Succesfully connected to MongoDB');
  seeder.seed(data).then(function(dbData) {
    console.log('Succesfully loaded dummy data');
  }).catch(function(err) {
    console.log('Error: ' + err);
  });
});

// morgan gives us http request logging
app.use(morgan('dev'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/../views');

// router
var routes = require('../routes/index');
app.use('/', routes);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
