'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');


// this lets us use *expect* style syntax in our tests
// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Server Routes', function() {
  
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the that promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  // although we only have one test module at the moment, we'll
  // close our server at the end of these tests. Otherwise,
  // if we add another test module that also has a `before` block
  // that starts our server, it will cause an error because the
  // server would still be running from the previous tests.
  after(function() {
    return closeServer();
  });

  describe('Index Page', function() {

    // test strategy:
    //   1. make request to `/`
    //   2. inspect response object and prove has right code in response object.
    it('should exist', function() {
      // for Mocha tests, when we're dealing with asynchronous operations,
      // we must either return a Promise object or else call a `done` callback
      // at the end of the test. The `chai.request(server).get...` call is asynchronous
      // and returns a Promise, so we just return it.
      return chai.request(app)
        .get('/')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });

  describe('Add Labor Page', function() {

    it('should return an HTML response', function() {

      return chai.request(app)
        .get('/addLabor')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          expect(res.body).to.not.be.null;
          expect(res.text.includes('<form>')).to.be.true;
        });

    })

  })

  describe('Add Sales Page', function() {

    it('should return an HTML response', function() {

      return chai.request(app)
        .get('/addSales')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          expect(res.body).to.not.be.null;
          expect(res.text.includes('<form>')).to.be.true;
        });

    })

  })

  describe('Search Results Page', function() {

    it('should exist', function() {
      
      return chai.request(app)
        .get('/searchResults')
        .then(function(res) {
          expect(res).to.have.status(200);
        });
    });
  });

})




