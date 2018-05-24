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
  return totalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('totalRegGrossPay').get(function() {
  const totalRegGrossPay = this.bakrsRegGrossPay +  
  						this.csrvcRegGrossPay +
  						this.drvrsRegGrossPay +
  						this.jntrsRegGrossPay +
  						this.pckrsRegGrossPay;
  return totalRegGrossPay.toFixed(2);
});

laborWeekSchema.virtual('totalOTGrossPay').get(function() {
  const totalOTGrossPay = this.bakrsOTGrossPay + 
  						this.csrvcOTGrossPay +
  						this.drvrsOTGrossPay +
  						this.jntrsOTGrossPay +
  						this.pckrsOTGrossPay;
  return totalOTGrossPay.toFixed(2);
});

laborWeekSchema.virtual('bakrsTotalGrossPay').get(function() {
  const bakrsTotalGrossPay = this.bakrsRegGrossPay + 
  						this.bakrsOTGrossPay;
  return bakrsTotalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('csrvcTotalGrossPay').get(function() {
  const csrvcTotalGrossPay = this.csrvcRegGrossPay + 
  						this.csrvcOTGrossPay;
  return csrvcTotalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('drvrsTotalGrossPay').get(function() {
  const drvrsTotalGrossPay = this.drvrsRegGrossPay + 
  						this.drvrsOTGrossPay;
  return drvrsTotalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('jntrsTotalGrossPay').get(function() {
  const jntrsTotalGrossPay = this.jntrsRegGrossPay + 
  						this.jntrsOTGrossPay;
  return jntrsTotalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('pckrsTotalGrossPay').get(function() {
  const pckrsTotalGrossPay = this.pckrsRegGrossPay + 
  						this.pckrsOTGrossPay;
  return pckrsTotalGrossPay.toFixed(2);
});

laborWeekSchema.virtual('totalHours').get(function() {
  const totalHours = this.bakrsRegHours + 
  						this.bakrsOTHours + 
  						this.csrvcRegHours +
  						this.csrvcOTHours +
  						this.drvrsRegHours +
  						this.drvrsOTHours +
  						this.jntrsRegHours +
  						this.jntrsOTHours +
  						this.pckrsRegHours +
  						this.pckrsOTHours;
  return totalHours.toFixed(2);
});

laborWeekSchema.virtual('totalRegHours').get(function() {
  const totalRegHours = this.bakrsRegHours +  
  						this.csrvcRegHours +
  						this.drvrsRegHours +
  						this.jntrsRegHours +
  						this.pckrsRegHours;
  return totalRegHours.toFixed(2);
});

laborWeekSchema.virtual('totalOTHours').get(function() {
  const totalOTHours = this.bakrsOTHours + 
  						this.csrvcOTHours +
  						this.drvrsOTHours +
  						this.jntrsOTHours +
  						this.pckrsOTHours;
  return totalOTHours.toFixed(2);
});

laborWeekSchema.virtual('bakrsTotalHours').get(function() {
  const bakrsTotalHours = this.bakrsRegHours + 
  						this.bakrsOTHours;
  return bakrsTotalHours.toFixed(2);
});

laborWeekSchema.virtual('csrvcTotalHours').get(function() {
  const csrvcTotalHours = this.csrvcRegHours + 
  						this.csrvcOTHours;
  return csrvcTotalHours.toFixed(2);
});

laborWeekSchema.virtual('drvrsTotalHours').get(function() {
  const drvrsTotalHours = this.drvrsRegHours + 
  						this.drvrsOTHours;
  return drvrsTotalHours.toFixed(2);
});

laborWeekSchema.virtual('jntrsTotalHours').get(function() {
  const jntrsTotalHours = this.jntrsRegHours + 
  						this.jntrsOTHours;
  return jntrsTotalHours.toFixed(2);
});

laborWeekSchema.virtual('pckrsTotalHours').get(function() {
  const pckrsTotalHours = this.pckrsRegHours + 
  						this.pckrsOTHours;
  return pckrsTotalHours.toFixed(2);
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
  	periodEndDate: this.periodEndDate,
  	totalHours: this.totalHours,
  	totalRegHours: this.totalRegHours,
  	totalOTHours: this.totalOTHours,
  	totalGrossPay: this.totalGrossPay,
  	totalRegGrossPay: this.totalRegGrossPay,
  	totalOTGrossPay: this.totalOTGrossPay,
	bakrsTotalHours: this.bakrsTotalHours,
	bakrsRegHours: this.bakrsRegHours,
	bakrsOTHours: this.bakrsOTHours,
	bakrsTotalGrossPay: this.bakrsTotalGrossPay,
	bakrsRegGrossPay: this.bakrsRegGrossPay,
	bakrsOTGrossPay: this.bakrsOTGrossPay,
	csrvcTotalHours: this.csrvcTotalHours,
	csrvcRegHours: this.csrvcRegHours,
	csrvcOTHours: this.csrvcOTHours,
	csrvcTotalGrossPay: this.csrvcTotalGrossPay,
	csrvcRegGrossPay: this.csrvcRegGrossPay,
	csrvcOTGrossPay: this.csrvcOTGrossPay,
	drvrsTotalHours: this.drvrsTotalHours,
	drvrsRegHours: this.drvrsRegHours,
	drvrsOTHours: this.drvrsOTHours,
	drvrsTotalGrossPay: this.drvrsTotalGrossPay,
	drvrsRegGrossPay: this.drvrsRegGrossPay,
	drvrsOTGrossPay: this.drvrsOTGrossPay,
	jntrsTotalHours: this.jntrsTotalHours,
	jntrsRegHours: this.jntrsRegHours,
	jntrsOTHours: this.jntrsOTHours,
	jntrsTotalGrossPay: this.jntrsTotalGrossPay,
	jntrsRegGrossPay: this.jntrsRegGrossPay,
	jntrsOTGrossPay: this.jntrsOTGrossPay,
	pckrsTotalHours: this.pckrsTotalHours,
	pckrsRegHours: this.pckrsRegHours,
	pckrsOTHours: this.pckrsOTHours,
	pckrsTotalGrossPay: this.pckrsTotalGrossPay,
	pckrsRegGrossPay: this.pckrsRegGrossPay,
	pckrsOTGrossPay: this.pckrsOTGrossPay
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