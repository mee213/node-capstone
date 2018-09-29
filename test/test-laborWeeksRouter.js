'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {LaborWeek} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const seedData = require('../labor-seed-data.json')

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
                'pckrsOTGrossPay',
                );
            });
            resLaborWeek = res.body[0];
            return LaborWeek.findOne({week_id: resLaborWeek.week_id});
          })
          .then(function(laborWeek) {
            expect(resLaborWeek.week_id).to.equal(laborWeek.week_id);
            expect(resLaborWeek.periodEndDate).to.equal(laborWeek.periodEndDate);
            expect(resLaborWeek.bakrsRegHours).to.equal(laborWeek.bakrsRegHours);
            expect(resLaborWeek.bakrsOTHours).to.equal(laborWeek.bakrsOTHours);
            expect(resLaborWeek.bakrsRegGrossPay).to.equal(laborWeek.bakrsRegGrossPay);
            expect(resLaborWeek.bakrsOTGrossPay).to.equal(laborWeek.bakrsOTGrossPay);
            expect(resLaborWeek.csrvcRegHours).to.equal(laborWeek.csrvcRegHours);
            expect(resLaborWeek.csrvcOTHours).to.equal(laborWeek.csrvcOTHours);
            expect(resLaborWeek.csrvcRegGrossPay).to.equal(laborWeek.csrvcRegGrossPay);
            expect(resLaborWeek.csrvcOTGrossPay).to.equal(laborWeek.csrvcOTGrossPay);
            expect(resLaborWeek.drvrsRegHours).to.equal(laborWeek.drvrsRegHours);
            expect(resLaborWeek.drvrsOTHours).to.equal(laborWeek.drvrsOTHours);
            expect(resLaborWeek.drvrsRegGrossPay).to.equal(laborWeek.drvrsRegGrossPay);
            expect(resLaborWeek.drvrsOTGrossPay).to.equal(laborWeek.drvrsOTGrossPay);
            expect(resLaborWeek.jntrsRegHours).to.equal(laborWeek.jntrsRegHours);
            expect(resLaborWeek.jntrsOTHours).to.equal(laborWeek.jntrsOTHours);
            expect(resLaborWeek.jntrsRegGrossPay).to.equal(laborWeek.jntrsRegGrossPay);
            expect(resLaborWeek.jntrsOTGrossPay).to.equal(laborWeek.jntrsOTGrossPay);
            expect(resLaborWeek.pckrsRegHours).to.equal(laborWeek.pckrsRegHours);
            expect(resLaborWeek.pckrsOTHours).to.equal(laborWeek.pckrsOTHours);
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
          title: faker.lorem.sentence(),
          author: {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          },
          content: faker.lorem.text()
        };

        let authorName = `${newLaborWeek.author.firstName} ${newLaborWeek.author.lastName}`.trim();

        return chai.request(app)
          .post('/laborWeeks')
          .send(newLaborWeek)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(
              'id', 'author', 'title', 'content', 'created');
            // cause Mongo should have created id on insertion
            expect(res.body.id).to.not.be.null;
            expect(res.body.title).to.equal(newBlogPost.title);
            expect(res.body.content).to.equal(newBlogPost.content);
            expect(res.body.author).to.equal(authorName);
            return LaborWeek.findById(res.body.id);
          })
          .then(function(laborWeek) {
            expect(blogPost.id).to.not.be.null;
            expect(blogPost.title).to.equal(newBlogPost.title);
            expect(blogPost.content).to.equal(newBlogPost.content);
            expect(blogPost.author.firstName).to.equal(newBlogPost.author.firstName);
            expect(blogPost.author.lastName).to.equal(newBlogPost.author.lastName);
          });
      });
  });









    it('should add an item on POST', function() {
      const newItem = {name: 'coffee', checked: false};
      return chai.request(app)
        .post('/shopping-list')
        .send(newItem)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'name', 'checked');
          expect(res.body.id).to.not.equal(null);
          // response should be deep equal to `newItem` from above if we assign
          // `id` to it from `res.body.id`
          expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
    });
});
});
