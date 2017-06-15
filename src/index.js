'use strict';

// load modules
const express = require('express'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    seeder = require('mongoose-seeder'),
    data = require('./data/data.json'),
    session = require('express-session');


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

// MongoDB error / connection logs
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log('Succesfully connected to MongoDB');
  seeder.seed(data).then(function(dbData) {
    console.log('Succesfully loaded dummy data');
  }).catch(function(err) {
    console.log('Error: ' + err);
  });
});

// setting up Mongo as session store
var MongoStore = require('connect-mongo')(session);

// making session available application-wide for auth
app.use(session({
  secret: 'courserating',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

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

module.exports = app; // for testing