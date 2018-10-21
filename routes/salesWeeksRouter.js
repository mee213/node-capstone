'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const {SalesWeek} = require('../models');

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
router.get('/:weekId', (req, res) => {
  SalesWeek
    .findOne({week_id: req.params.weekId})
    .then(salesweek => res.json(salesweek.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// when new sales week added, ensure has required fields. if not,
// log error and return 400 status code with helpful message.
// if okay, add new sales week, and return it with a status 201.
router.post('/', (req, res) => {

  const requiredFields = ['week_id',
                          'sunSales',
                          'monSales',
                          'tueSales',
                          'wedSales',
                          'thuSales',
                          'friSales',
                          'satSales',
                          'sunDate',
                          'monDate',
                          'tueDate',
                          'wedDate',
                          'thuDate',
                          'friDate',
                          'satDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  SalesWeek
    .create({
      week_id: req.body.week_id,
      sunSales: req.body.sunSales,
      monSales: req.body.monSales,
      tueSales: req.body.tueSales,
      wedSales: req.body.wedSales,
      thuSales: req.body.thuSales,
      friSales: req.body.friSales,
      satSales: req.body.satSales,
      sunDate: req.body.sunDate,
      monDate: req.body.monDate,
      tueDate: req.body.tueDate,
      wedDate: req.body.wedDate,
      thuDate: req.body.thuDate,
      friDate: req.body.friDate,
      satDate: req.body.satDate 
    })
    .then(salesweek => res.status(201).json(salesweek.serialize()))
    .catch(err => {
      console.error(err);
      if (err.code==11000) {
        res.status(500).json({ message: 'A sales entry with this week number already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    });
});

router.put('/:week_id', (req, res) => {
  if (!(req.params.week_id && req.body.week_id && req.params.week_id === req.body.week_id)) {
    res.status(400).json({
      error: 'Request path week_id and request body week_id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['sunSales',
                          'monSales',
                          'tueSales',
                          'wedSales',
                          'thuSales',
                          'friSales',
                          'satSales',
                          'sunDate',
                          'monDate',
                          'tueDate',
                          'wedDate',
                          'thuDate',
                          'friDate',
                          'satDate'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  SalesWeek
    .findOneAndUpdate({week_id: req.params.week_id}, { $set: updated }, { new: true })
    .then(updatedSalesWeek => res.status(200).json(updatedSalesWeek.serialize()))
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


router.delete('/:week_id', (req, res) => {
  SalesWeek
    .findOneAndRemove({week_id: req.params.week_id})
    .then(() => {
      console.log(`Deleted sales week with week_id \`${req.params.week_id}\``);
      res.status(204).end();
    });
});


// catch-all endpoint if client makes request to non-existent endpoint
router.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


module.exports = router;