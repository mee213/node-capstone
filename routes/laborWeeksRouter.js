'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());

const {LaborWeek} = require('../models');



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

// when new labor week added, ensure has required fields. if not,
// log error and return 400 status code with helpful message.
// if okay, add new labor week, and return it with a status 201.
router.post('/', (req, res) => {

  console.log('laborWeeksRouter post endpoint ran');
  console.log(req.body);
  console.log(req);


  const requiredFields = ['week_id',
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
                          'pckrsOTGrossPay'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!req.body[field]) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  LaborWeek
    .create({
      week_id: req.body.week_id,
      periodEndDate: req.body.periodEndDate,
      bakrsRegHours: req.body.bakrsRegHours,
      bakrsOTHours: req.body.bakrsOTHours,
      bakrsRegGrossPay: req.body.bakrsRegGrossPay,
      bakrsOTGrossPay: req.body.bakrsOTGrossPay,
      csrvcRegHours: req.body.csrvcRegHours,
      csrvcOTHours: req.body.csrvcOTHours,
      csrvcRegGrossPay: req.body.csrvcRegGrossPay,
      csrvcOTGrossPay: req.body.csrvcOTGrossPay,
      drvrsRegHours: req.body.drvrsRegHours,
      drvrsOTHours: req.body.drvrsOTHours,
      drvrsRegGrossPay: req.body.drvrsRegGrossPay,
      drvrsOTGrossPay: req.body.drvrsOTGrossPay,
      jntrsRegHours: req.body.jntrsRegHours,
      jntrsOTHours: req.body.jntrsOTHours,
      jntrsRegGrossPay: req.body.jntrsRegGrossPay,
      jntrsOTGrossPay: req.body.jntrsOTGrossPay,
      pckrsRegHours: req.body.pckrsRegHours,
      pckrsOTHours: req.body.pckrsOTHours,
      pckrsRegGrossPay: req.body.pckrsRegGrossPay,
      pckrsOTGrossPay: req.body.pckrsOTGrossPay
    })
    .then(laborweek => res.status(201).json(laborweek.serialize()))
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

