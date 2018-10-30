'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {SalesWeek} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const seedData = require('../sales-seed-data.json');

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
function seedSalesWeeksData(data) {
  // eslint-disable-next-line no-console
  console.info('seeding sales weeks data');
  
  // this will return a promise
  return SalesWeek.insertMany(data);
}

// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  // eslint-disable-next-line no-console
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Sales Weeks Router', function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
      return seedSalesWeeksData(seedData);
    });

    afterEach(function() {
      return tearDownDb();
    });

    after(function() {
      return closeServer();
    });

    describe('GET /', function() {
        // strategy:
        //    1. get back all sales weeks returned by GET request to `/salesWeeks`
        //    2. prove res has right status, data type
        //    3. prove the number of sales weeks we got back is equal to number
        //       in db.
        //
        // need to have access to mutate and access `res` across
        // `.then()` calls below, so declare it here so can modify in place

        it('should return all exising sales weeks', function() {

          let res;
        
          return chai.request(app)
            .get('/salesWeeks')
            .then(function(_res) {
              // so subsequent .then blocks can access response object
              res = _res;
              expect(res).to.have.status(200);

              // otherwise our db seeding didn't work
              expect(res.body).to.have.lengthOf.at.least(1);
              return SalesWeek.count();
            })
            .then(function(count) {
              expect(res.body).to.have.lengthOf(count);
            });
        });

        it('should return sales weeks with right fields', function() {
            // Strategy: Get back all sales weeks, and ensure they have expected keys

            let resSalesWeek;
            return chai.request(app)
              .get('/salesWeeks')
              .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body).to.have.lengthOf.at.least(1);

                res.body.forEach(function(salesWeek) {
                  expect(salesWeek).to.be.a('object');
                  expect(salesWeek).to.include.keys(
                    'week_id',
                    'totalSales', 
                    'startDate'
                    );
                });
                resSalesWeek = res.body[0];
                return SalesWeek.findOne({week_id: resSalesWeek.week_id});
              })
              .then(function(salesWeek) {
                expect(resSalesWeek.week_id).to.equal(salesWeek.week_id);
                expect(resSalesWeek.totalSales).to.equal(salesWeek.totalSales);
                expect(resSalesWeek.startDate).to.equal(salesWeek.sunDate);
                expect(resSalesWeek.created).to.not.be.null;
              });
            });

    });

    describe('POST /', function() {
    // strategy: make a POST request with data,
    // then prove that the sales week we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
      it('should add a new sales week', function() {

        const newSalesWeek = {
          "week_id": "201609",
          "sunSales": 9462.43,
          "monSales": 15435.20,
          "tueSales": 29534.20,
          "wedSales": 15743.20,
          "thuSales": 31535.53,
          "friSales": 18534.54,
          "satSales": 17634.54,
          "sunDate": "20160221",
          "monDate": "20160222",
          "tueDate": "20160223",
          "wedDate": "20160224",
          "thuDate": "20160225",
          "friDate": "20160226",
          "satDate": "20160227"
        };

        return chai.request(app)
          .post('/salesWeeks')
          .send(newSalesWeek)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(
                'week_id',
                'totalSales', 
                'startDate');
            // cause Mongo should have created id on insertion
            expect(res.body.id).to.not.be.null;
            expect(res.body.week_id).to.equal(newSalesWeek.week_id);
            expect(res.body.startDate).to.equal(newSalesWeek.sunDate);
            return SalesWeek.findOne({week_id: res.body.week_id});
          })
          .then(function(salesWeek) {
            expect(salesWeek.id).to.not.be.null;
            expect(salesWeek.week_id).to.equal(newSalesWeek.week_id);
            expect(salesWeek.sunSales).to.equal(newSalesWeek.sunSales);
            expect(salesWeek.monSales).to.equal(newSalesWeek.monSales);
            expect(salesWeek.tueSales).to.equal(newSalesWeek.tueSales);
            expect(salesWeek.wedSales).to.equal(newSalesWeek.wedSales);
            expect(salesWeek.thuSales).to.equal(newSalesWeek.thuSales);
            expect(salesWeek.friSales).to.equal(newSalesWeek.friSales);
            expect(salesWeek.satSales).to.equal(newSalesWeek.satSales);
            expect(salesWeek.sunDate).to.equal(newSalesWeek.sunDate);
            expect(salesWeek.monDate).to.equal(newSalesWeek.monDate);
            expect(salesWeek.tueDate).to.equal(newSalesWeek.tueDate);
            expect(salesWeek.wedDate).to.equal(newSalesWeek.wedDate);
            expect(salesWeek.thuDate).to.equal(newSalesWeek.thuDate);
            expect(salesWeek.friDate).to.equal(newSalesWeek.friDate);
            expect(salesWeek.satDate).to.equal(newSalesWeek.satDate);
          });
      });
    });

    describe('PUT /', function() {

      // strategy:
      //  1. Get an existing sales week from db
      //  2. Make a PUT request to update that sales week
      //  3. Prove sales week returned by request contains data we sent
      //  4. Prove sales week in db is correctly updated
      it('should update fields you send over', function() {
        const updateData = {
          monSales: 1323.62,
          friSales: 150.00,
          satSales: 20000.09
        };

        return SalesWeek
          .findOne()
          .then(function(salesWeek) {
            updateData.week_id = salesWeek.week_id;

            // make request then inspect it to make sure it reflects
            // data we sent
            return chai.request(app)
              .put(`/salesWeeks/${salesWeek.week_id}`)
              .send(updateData);
          })
          .then(function(res) {
            expect(res).to.have.status(200);

            return SalesWeek.findOne({week_id: updateData.week_id});
          })
          .then(function(salesWeek) {
            expect(salesWeek.monSales).to.equal(updateData.monSales);
            expect(salesWeek.friSales).to.equal(updateData.friSales);
            expect(salesWeek.satSales).to.equal(updateData.satSales);
          });
      });
    });

    describe('DELETE /', function() {
        // strategy:
        //  1. get a sales week
        //  2. make a DELETE request for that sales week's week_id
        //  3. assert that response has right status code
        //  4. prove that sales week with the week_id doesn't exist in db anymore
        it('delete a sales week by week_id', function() {

          let salesWeek;

          return SalesWeek
            .findOne()
            .then(function(_salesWeek) {
              salesWeek = _salesWeek;
              return chai.request(app).delete(`/salesWeeks/${salesWeek.week_id}`);
            })
            .then(function(res) {
              expect(res).to.have.status(204);
              return SalesWeek.findOne({week_id: salesWeek.week_id});
            })
            .then(function(_salesWeek) {
              expect(_salesWeek).to.be.null;
            });
        });
    });
});