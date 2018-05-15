'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. Here we use it
// to generate a human readable string based on the author object
// we're storing in Mongo.
laborWeekSchema.virtual('totalGrossPay').get(function() {
  const totalGrossPay = this.bakrsRegGrossPay + 
  						this.bakrsOTGrossPay + 
  						this.csrvcRegGrossPay +
  						this.csrvcOTGrossPay +
  						this.drvrsRegGrossPay +
  						this.drvrsOTGrossPay +
  						this.jntrsRegGrossPay +
  						this.jntrsOTGrossPay +
  						this.pckrsRegGrossPay +
  						this.pckrsOTGrossPay;
  return totalGrossPay;
});

salesWeekSchema.virtual('totalSales').get(function() {
  const totalSales = 	this.sunSales + 
  						this.monSales + 
  						this.tueSales +
  						this.wedSales +
  						this.thuSales +
  						this.friSales +
  						this.satSales;
  return totalSales.toFixed(2);
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
laborWeekSchema.methods.serialize = function() {

  return {
  	week_id: this.week_id,
  	totalGrossPay: this.totalGrossPay
  };
};

salesWeekSchema.methods.serialize = function() {

  return {
  	week_id: this.week_id,
  	totalSales: this.totalSales,
  	startDate: this.sunDate
  };
};

const LaborWeek = mongoose.model('LaborWeek', laborWeekSchema);

const SalesWeek = mongoose.model('SalesWeek', salesWeekSchema);

module.exports = {LaborWeek, SalesWeek};