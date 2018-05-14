'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, DATABASE_URL } = require('./config');

const app = express();

const laborWeeksRouter = require('./laborWeeksRouter');
const salesWeeksRouter = require('./salesWeeksRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// when requests come into `/labor` or
// `/sales`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/laborWeeks', laborWeeksRouter);
app.use('/salesWeeks', salesWeeksRouter);

// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
// this function connects to our database,
// then starts the server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });  
  });
}


// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one. we'll use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
          // return so we don't also call `resolve()`
        }
        resolve();
      });
    });
  }); 
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
