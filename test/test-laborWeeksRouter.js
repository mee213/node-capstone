'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {LaborWeek} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const seedData = require('../labor-seed-data.json');

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
function seedLaborWeeksData(data) {
  console.info('seeding labor weeks data');
  
  // this will return a promise
  return LaborWeek.insertMany(data);
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
      return seedLaborWeeksData(seedData);
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
        

        it('should return all exising labor weeks', function() {

          let res;
        
          return chai.request(app)
            .get('/laborWeeks')
            .then(function(_res) {
              // so subsequent .then blocks can access response object
              res = _res;
              expect(res).to.have.status(200);

              // otherwise our db seeding didn't work
              expect(res.body).to.have.lengthOf.at.least(1);
              return LaborWeek.count();
            })
            .then(function(count) {
              expect(res.body).to.have.lengthOf(count);
            });
        }); 

        it('should return labor weeks with right fields', function() {
        // Strategy: Get back all labor weeks, and ensure they have expected keys

        let resLaborWeek;
        return chai.request(app)
          .get('/laborWeeks')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.lengthOf.at.least(1);

            res.body.forEach(function(laborWeek) {
              expect(laborWeek).to.be.a('object');
              expect(laborWeek).to.include.keys(
                'week_id',
                'periodEndDate', 
                'totalHours',
                'totalRegHours',
                'totalOTHours',
                'totalGrossPay',
                'totalRegGrossPay',
                'totalOTGrossPay',
                'bakrsTotalHours',
                'bakrsRegHours',
                'bakrsOTHours',
                'bakrsTotalGrossPay',
                'bakrsRegGrossPay',
                'bakrsOTGrossPay',
                'csrvcTotalHours',
                'csrvcRegHours',
                'csrvcOTHours',
                'csrvcTotalGrossPay',
                'csrvcRegGrossPay',
                'csrvcOTGrossPay',
                'drvrsTotalHours',
                'drvrsRegHours',
                'drvrsOTHours',
                'drvrsTotalGrossPay',
                'drvrsRegGrossPay',
                'drvrsOTGrossPay',
                'jntrsTotalHours',
                'jntrsRegHours',
                'jntrsOTHours',
                'jntrsTotalGrossPay',
                'jntrsRegGrossPay',
                'jntrsOTGrossPay',
                'pckrsTotalHours',
                'pckrsRegHours',
                'pckrsOTHours',
                'pckrsTotalGrossPay',
                'pckrsRegGrossPay',
                'pckrsOTGrossPay'
                );
            });
            resLaborWeek = res.body[0];
            return LaborWeek.findOne({week_id: resLaborWeek.week_id});
          })
          .then(function(laborWeek) {
            expect(resLaborWeek.week_id).to.equal(laborWeek.week_id);
            expect(resLaborWeek.periodEndDate).to.equal(laborWeek.periodEndDate);
            expect(resLaborWeek.totalHours).to.equal(laborWeek.totalHours);
            expect(resLaborWeek.totalRegHours).to.equal(laborWeek.totalRegHours);
            expect(resLaborWeek.totalOTHours).to.equal(laborWeek.totalOTHours);
            expect(resLaborWeek.totalGrossPay).to.equal(laborWeek.totalGrossPay);
            expect(resLaborWeek.totalRegGrossPay).to.equal(laborWeek.totalRegGrossPay);
            expect(resLaborWeek.totalOTGrossPay).to.equal(laborWeek.totalOTGrossPay);
            expect(resLaborWeek.bakrsTotalHours).to.equal(laborWeek.bakrsTotalHours);
            expect(resLaborWeek.bakrsRegHours).to.equal(laborWeek.bakrsRegHours);
            expect(resLaborWeek.bakrsOTHours).to.equal(laborWeek.bakrsOTHours);
            expect(resLaborWeek.bakrsTotalGrossPay).to.equal(laborWeek.bakrsTotalGrossPay);
            expect(resLaborWeek.bakrsRegGrossPay).to.equal(laborWeek.bakrsRegGrossPay);
            expect(resLaborWeek.bakrsOTGrossPay).to.equal(laborWeek.bakrsOTGrossPay);
            expect(resLaborWeek.csrvcTotalHours).to.equal(laborWeek.csrvcTotalHours);
            expect(resLaborWeek.csrvcRegHours).to.equal(laborWeek.csrvcRegHours);
            expect(resLaborWeek.csrvcOTHours).to.equal(laborWeek.csrvcOTHours);
            expect(resLaborWeek.csrvcTotalGrossPay).to.equal(laborWeek.csrvcTotalGrossPay);
            expect(resLaborWeek.csrvcRegGrossPay).to.equal(laborWeek.csrvcRegGrossPay);
            expect(resLaborWeek.csrvcOTGrossPay).to.equal(laborWeek.csrvcOTGrossPay);
            expect(resLaborWeek.drvrsTotalHours).to.equal(laborWeek.drvrsTotalHours);
            expect(resLaborWeek.drvrsRegHours).to.equal(laborWeek.drvrsRegHours);
            expect(resLaborWeek.drvrsOTHours).to.equal(laborWeek.drvrsOTHours);
            expect(resLaborWeek.drvrsTotalGrossPay).to.equal(laborWeek.drvrsTotalGrossPay);
            expect(resLaborWeek.drvrsRegGrossPay).to.equal(laborWeek.drvrsRegGrossPay);
            expect(resLaborWeek.drvrsOTGrossPay).to.equal(laborWeek.drvrsOTGrossPay);
            expect(resLaborWeek.jntrsTotalHours).to.equal(laborWeek.jntrsTotalHours);
            expect(resLaborWeek.jntrsRegHours).to.equal(laborWeek.jntrsRegHours);
            expect(resLaborWeek.jntrsOTHours).to.equal(laborWeek.jntrsOTHours);
            expect(resLaborWeek.jntrsTotalGrossPay).to.equal(laborWeek.jntrsTotalGrossPay);
            expect(resLaborWeek.jntrsRegGrossPay).to.equal(laborWeek.jntrsRegGrossPay);
            expect(resLaborWeek.jntrsOTGrossPay).to.equal(laborWeek.jntrsOTGrossPay);
            expect(resLaborWeek.pckrsTotalHours).to.equal(laborWeek.pckrsTotalHours);
            expect(resLaborWeek.pckrsRegHours).to.equal(laborWeek.pckrsRegHours);
            expect(resLaborWeek.pckrsOTHours).to.equal(laborWeek.pckrsOTHours);
            expect(resLaborWeek.pckrsTotalGrossPay).to.equal(laborWeek.pckrsTotalGrossPay);
            expect(resLaborWeek.pckrsRegGrossPay).to.equal(laborWeek.pckrsRegGrossPay);
            expect(resLaborWeek.pckrsOTGrossPay).to.equal(laborWeek.pckrsOTGrossPay);
            expect(resLaborWeek.created).to.not.be.null;
          });
        });

    });

    describe('POST /', function() {
    // strategy: make a POST request with data,
    // then prove that the labor week we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
      it('should add a new labor week', function() {

        const newLaborWeek = {
          "week_id": "201609",
          "periodEndDate": "20160226",
          "bakrsRegHours": 1425.63,
          "bakrsOTHours": 154.57,
          "bakrsRegGrossPay": 18139.55,
          "bakrsOTGrossPay": 2893.66,
          "csrvcRegHours": 117.94,
          "csrvcOTHours": 6.73,
          "csrvcRegGrossPay": 1659.66,
          "csrvcOTGrossPay": 142.33,
          "drvrsRegHours": 664.94,
          "drvrsOTHours": 103.20,
          "drvrsRegGrossPay": 7730.30,
          "drvrsOTGrossPay": 2070.20,
          "jntrsRegHours": 400.78,
          "jntrsOTHours": 11.33,
          "jntrsRegGrossPay": 4646.45,
          "jntrsOTGrossPay": 243.87,
          "pckrsRegHours": 976.80,
          "pckrsOTHours": 31.10,
          "pckrsRegGrossPay": 9645.75,
          "pckrsOTGrossPay": 500.60
        };

        return chai.request(app)
          .post('/laborWeeks')
          .send(newLaborWeek)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(
              'week_id',
              'periodEndDate', 
              'bakrsRegHours',
              'bakrsOTHours',
              'bakrsRegGrossPay',
              'bakrsOTGrossPay',
              'csrvcRegHours',
              'csrvcOTHours',
              'csrvcRegGrossPay',
              'csrvcOTGrossPay',
              'drvrsRegHours',
              'drvrsOTHours',
              'drvrsRegGrossPay',
              'drvrsOTGrossPay',
              'jntrsRegHours',
              'jntrsOTHours',
              'jntrsRegGrossPay',
              'jntrsOTGrossPay',
              'pckrsRegHours',
              'pckrsOTHours',
              'pckrsRegGrossPay',
              'pckrsOTGrossPay');
            // cause Mongo should have created id on insertion
            expect(res.body.id).to.not.be.null;
            expect(res.body.week_id).to.equal(newLaborWeek.week_id);
            expect(res.body.periodEndDate).to.equal(newLaborWeek.periodEndDate);
            expect(res.body.bakrsRegHours).to.equal(newLaborWeek.bakrsRegHours);
            expect(res.body.bakrsOTHours).to.equal(newLaborWeek.bakrsOTHours);
            expect(res.body.bakrsRegGrossPay).to.equal(newLaborWeek.bakrsRegGrossPay);
            expect(res.body.bakrsOTGrossPay).to.equal(newLaborWeek.bakrsOTGrossPay);
            expect(res.body.csrvcRegHours).to.equal(newLaborWeek.csrvcRegHours);
            expect(res.body.csrvcOTHours).to.equal(newLaborWeek.csrvcOTHours);
            expect(res.body.csrvcRegGrossPay).to.equal(newLaborWeek.csrvcRegGrossPay);
            expect(res.body.csrvcOTGrossPay).to.equal(newLaborWeek.csrvcOTGrossPay);
            expect(res.body.drvrsRegHours).to.equal(newLaborWeek.drvrsRegHours);
            expect(res.body.drvrsOTHours).to.equal(newLaborWeek.drvrsOTHours);
            expect(res.body.drvrsRegGrossPay).to.equal(newLaborWeek.drvrsRegGrossPay);
            expect(res.body.drvrsOTGrossPay).to.equal(newLaborWeek.drvrsOTGrossPay);
            expect(res.body.jntrsRegHours).to.equal(newLaborWeek.jntrsRegHours);
            expect(res.body.jntrsOTHours).to.equal(newLaborWeek.jntrsOTHours);
            expect(res.body.jntrsRegGrossPay).to.equal(newLaborWeek.jntrsRegGrossPay);
            expect(res.body.jntrsOTGrossPay).to.equal(newLaborWeek.jntrsOTGrossPay);
            expect(res.body.pckrsRegHours).to.equal(newLaborWeek.pckrsRegHours);
            expect(res.body.pckrsOTHours).to.equal(newLaborWeek.pckrsOTHours);
            expect(res.body.pckrsRegGrossPay).to.equal(newLaborWeek.pckrsRegGrossPay);
            expect(res.body.pckrsOTGrossPay).to.equal(newLaborWeek.pckrsOTGrossPay);
            return LaborWeek.findOne({week_id: res.body.week_id});
          })
          .then(function(laborWeek) {
            expect(laborWeek.id).to.not.be.null;
            expect(laborWeek.week_id).to.equal(newLaborWeek.week_id);
            expect(laborWeek.periodEndDate).to.equal(newLaborWeek.periodEndDate);
            expect(laborWeek.bakrsRegHours).to.equal(newLaborWeek.bakrsRegHours);
            expect(laborWeek.bakrsOTHours).to.equal(newLaborWeek.bakrsOTHours);
            expect(laborWeek.bakrsRegGrossPay).to.equal(newLaborWeek.bakrsRegGrossPay);
            expect(laborWeek.bakrsOTGrossPay).to.equal(newLaborWeek.bakrsOTGrossPay);
            expect(laborWeek.csrvcRegHours).to.equal(newLaborWeek.csrvcRegHours);
            expect(laborWeek.csrvcOTHours).to.equal(newLaborWeek.csrvcOTHours);
            expect(laborWeek.csrvcRegGrossPay).to.equal(newLaborWeek.csrvcRegGrossPay);
            expect(laborWeek.csrvcOTGrossPay).to.equal(newLaborWeek.csrvcOTGrossPay);
            expect(laborWeek.drvrsRegHours).to.equal(newLaborWeek.drvrsRegHours);
            expect(laborWeek.drvrsOTHours).to.equal(newLaborWeek.drvrsOTHours);
            expect(laborWeek.drvrsRegGrossPay).to.equal(newLaborWeek.drvrsRegGrossPay);
            expect(laborWeek.drvrsOTGrossPay).to.equal(newLaborWeek.drvrsOTGrossPay);
            expect(laborWeek.jntrsRegHours).to.equal(newLaborWeek.jntrsRegHours);
            expect(laborWeek.jntrsOTHours).to.equal(newLaborWeek.jntrsOTHours);
            expect(laborWeek.jntrsRegGrossPay).to.equal(newLaborWeek.jntrsRegGrossPay);
            expect(laborWeek.jntrsOTGrossPay).to.equal(newLaborWeek.jntrsOTGrossPay);
            expect(laborWeek.pckrsRegHours).to.equal(newLaborWeek.pckrsRegHours);
            expect(laborWeek.pckrsOTHours).to.equal(newLaborWeek.pckrsOTHours);
            expect(laborWeek.pckrsRegGrossPay).to.equal(newLaborWeek.pckrsRegGrossPay);
            expect(laborWeek.pckrsOTGrossPay).to.equal(newLaborWeek.pckrsOTGrossPay);
          });
      });
    });
});
