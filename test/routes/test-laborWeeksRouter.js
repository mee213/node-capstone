'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {LaborWeek} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const seedData = require('../../labor-seed-data.json')

// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

// used to put seed documents in db
// so we have data to work with and assert about.
function seedLaborWeeksData(seedData) {
  console.info('seeding blog post data');
  
  // this will return a promise
  return LaborWeek.insertMany(seedData);
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Labor Weeks Router', function() {

    before(function() {
    return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
    return seedLaborWeeksData();
    });

    afterEach(function() {
    return tearDownDb();
    });

    after(function() {
    return closeServer();
    });

    describe('GET /', function() {
        // strategy:
        //    1. get back all labor weeks returned by GET request to `/laborWeeks`
        //    2. prove res has right status, data type
        //    3. prove the number of labor weeks we got back is equal to number
        //       in db.
        //
        // need to have access to mutate and access `res` across
        // `.then()` calls below, so declare it here so can modify in place
        let res;
        return chai.request(app)
        .get('/laborWeeks')
        .then(function(_res) {
          // so subsequent .then blocks can access response object
          res = _res;
          expect(res).to.have.status(200);
          // otherwise our db seeding didn't work
          expect(res.body).to.have.lengthOf.at.least(1);
          return BlogPost.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    })
})
*/