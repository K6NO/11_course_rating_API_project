//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user').User;

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/index');
let should = chai.should();
var expect = require('chai').expect;

// Test suite (closely related unit tests)
// When I make a request to the GET route with the correct credentials, the corresponding user document is returned

chai.use(chaiHttp);
//Our parent block
describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });
});

describe('Mocha', function () {
    // Test spec (unit tests)
    it('should run the test with npm', function () {
        expect(true).to.be.ok; // -> ok truthy value
    });
});
describe('/ GET /users', function () {
    //it('should have a session id', function () {
    //
    //});
    //
    //it('should throw an error with wrong session id', function () {
    //
    //});
    //
    it('should return 200 - authenticated', function (done) {
        chai.request(server)
            .get('/api/users')
            .auth('joe@smith.com', 'password')
            //.set('Authorization', 'Basic am9lQHNtaXRoLmNvbTpwYXNzd29yZA==')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            })
    });

    it('should return 401 - unauthenticated', function (done) {
        chai.request(server)
            .get('/api/users')
            .end(function (err, res) {
                res.should.have.status(401);
                done();
            })
    });
});

//router.get('/api/users', mid.isAuthenticated, (req, res, next)=> {
//    console.log(req.session.userId);
//    User.findOne({_id: req.session.userId})
//        .exec(function(err, user){
//            console.log(user);
//            if (err) return next(err);
//            return res.json(user);
//        })
//});