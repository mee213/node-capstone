'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const request = require('request');

// Mongoose internally uses a promise-like object,
// but its better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const { PORT, DATABASE_URL } = require('./config');

const app = express();

//set the view engine to ejs
app.set('view engine', 'ejs');

const laborWeeksRouter = require('./routes/laborWeeksRouter');
const salesWeeksRouter = require('./routes/salesWeeksRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.use(express.json());


app.get('/', (req, res) => {
  res.render('pages/index');
});

app.get('/addLabor', (req, res) => {
  const week_id = req.query['week_id'];
  request(
    `${req.protocol}://${req.hostname}${(PORT ? ':' + PORT : '')}/laborWeeks/${week_id}`,
    (error, response, body) => {
      //console.log(body);
      res.render('pages/addLabor',{week_id: body.week_id});
    }
  );
});

app.get('/addSales', (req, res) => {
  const week_id = req.query['week_id'];
  request(
    `${req.protocol}://${req.hostname}${(PORT ? ':' + PORT : '')}/salesWeeks/${week_id}`,
    (error, response, body) => {
      console.log(body);
      res.render('pages/addSales',{week_id});
    }
  );
});

app.get('/searchResults', (req, res) => {
  res.render('pages/searchResults',{week_id: req.query['week_id']});
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
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
