'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());

const {SalesWeek} = require('./models');

// send back JSON representation of all sales data
// on GET requests to root
router.get('/', (req, res) => {
  SalesWeek
    .find()
    // success callback: for each week of sales we got back, we'll
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.
    .then(salesweeks => {
      res.json(salesweeks.map(salesweek => salesweek.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// send back JSON representation of single week of sales data on GET request by week_id
router.get('/:week_id', (req, res) => {
  SalesWeek
    .find({week_id: week_id})
    .then(salesweek => res.json(salesweek.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});
/*
// catch-all endpoint if client makes request to non-existent endpoint
router.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});
*/

module.exports = router;