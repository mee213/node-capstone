'use strict';

const express = require('express');
const router = express.Router();

router.use(express.json());

const {LaborWeek} = require('./models');