'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());

const {LaborWeek} = require('./models');

// send back JSON representation of all labor data
// on GET requests to root
router.get('/', (req, res) => {
  LaborWeek
    .find()
    // success callback: for each week of labor data we got back, we'll
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.
    .then(laborweeks => {
      res.json(laborweeks.map(laborweek => laborweek.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// send back JSON representation of single week of labor data on GET request by week_id
router.get('/:weekId', (req, res) => {
  LaborWeek
    .findOne({week_id: req.params.weekId})
    .then(laborweek => res.json(laborweek.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = router;

