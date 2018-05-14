'use strict';

const mongoose = require('mongoose');

// this is our schema to represent a week's worth of labor data
const laborWeekSchema = mongoose.Schema({
	week_id: {type: String, required: true}, // format YYYYWW
	periodEndDate: {type: String, required: true}, // format YYYYMMDD
	bakrsRegHours: {type: Number, required: true},
	bakrsOTHours: {type: Number, required: true},
	bakrsRegGrossPay: {type: Number, required: true},
	bakrsOTGrossPay: {type: Number, required: true},
	csrvcRegHours: {type: Number, required: true},
	csrvcOTHours: {type: Number, required: true},
	csrvcRegGrossPay: {type: Number, required: true},
	csrvcOTGrossPay: {type: Number, required: true},
	drvrsRegHours: {type: Number, required: true},
	drvrsOTHours: {type: Number, required: true},
	drvrsRegGrossPay: {type: Number, required: true},
	drvrsOTGrossPay: {type: Number, required: true},
	jntrsRegHours: {type: Number, required: true},
	jntrsOTHours: {type: Number, required: true},
	jntrsRegGrossPay: {type: Number, required: true},
	jntrsOTGrossPay: {type: Number, required: true},
	pckrsRegHours: {type: Number, required: true},
	pckrsOTHours: {type: Number, required: true},
	pckrsRegGrossPay: {type: Number, required: true},
	pckrsOTGrossPay: {type: Number, required: true},
});

// this is our schema to represent a week's worth of sales
const salesWeekSchema = mongoose.Schema({
	week_id: {type: String, required: true}, // format YYYYWW
	sunSales: {type: Number, required: true},
	monSales: {type: Number, required: true},
	tueSales: {type: Number, required: true},
	wedSales: {type: Number, required: true},
	thuSales: {type: Number, required: true},
	friSales: {type: Number, required: true},
	satSales: {type: Number, required: true},
	sunDate: {type: String, required: true}, // format YYYYMMDD
	monDate: {type: String, required: true},
	tueDate: {type: String, required: true},
	wedDate: {type: String, required: true},
	thuDate: {type: String, required: true},
	friDate: {type: String, required: true},
	satDate: {type: String, required: true}  		
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
laborWeekSchema.methods.serialize = function() {

  return this; // right now it returns everything, can change later as needed
}

salesWeekSchema.methods.serialize = function() {

  return this; // right now it returns everything, can change later as needed
}

const LaborWeek = mongoose.model('LaborWeek', laborWeekSchema);

const SalesWeek = mongoose.model('SalesWeek', salesWeekSchema);

module.exports = {LaborWeek, SalesWeek};