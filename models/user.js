'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var UserSchema = new Schema({
    emailAddress: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: 'The email you provided is not a valid.'
        },
        required: [true, 'Provide an email address.'],
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

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

UserSchema.statics.authenticate = function (email, password, callback){
  User.findOne({emailAddress: email})
      .exec(function (err, user) {
          if (err) {
              return callback(err);
          } else if (!user) {
              var noUserErr = new Error('User not found.');
              noUserErr.status = 401;
              return callback(noUserErr);
          }
          bcrypt.compare(password, user.password, function (err, result) {
              if(result === true){
                  return callback(null, user);
              } else {
                  return callback();
              }
          });
      });
};

UserSchema.plugin(uniqueValidator);

//UserSchema.pre('save', function (next) {
//    var user = this;
//    var isValidEmail = validator.isEmail(user.emailAddress);
//    if(!isValidEmail) {
//        let error = new Error('The email you provided is not a valid.');
//        error.status = 401;
//        return next(error);
//    }
//    next();
//});

// Model
var User = mongoose.model('User', UserSchema);

module.exports.User = User;
// Validators

// TODO user email validator --> move to separate module
//var badUser = new User({
//    emailAddress: undefined,
//    fullName: 'Tamas Kenessey',
//    password: 12345
//});
//
//var error = badUser.validateSync();
//assert.equal(error.errors['email'].message,
//    'Provide an email address.');
//
//badUser.emailAddress = 'ttttttt';
//
//error = badUser.validateSync();
//assert.equal(error.errors['email'].message,
//    'ttttttt is not a valid email address');
//
//badUser.emailAddress = 'tktk@gmail';
//
//error = badUser.validateSync();
//assert.equal(error.errors['email'].message,
//    'tktk@gmail is not a valid email address');
//
//badUser.emailAddress = 'tktk@gmail.com.';
//
//error = badUser.validateSync();
//assert.equal(error.errors['email'].message,
//    'tktk@gmail.com. is not a valid email address');
//
//badUser.emailAddress = 'tktk@gmail.com';
//// Validation succeeds! Email is defined and fulfills regex criteria
//error = user.validateSync();
//assert.equal(error, null);

