'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// this is our schema to represent a week's worth of labor data
const laborWeekSchema = mongoose.Schema({
    week_id: {type: String, required: true, unique: true}, // format YYYYWW
    periodEndDate: {type: String, required: true, unique: true}, // format YYYYMMDD
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
    week_id: {type: String, required: true, unique: true}, // format YYYYWW
    sunSales: {type: Number, required: true},
    monSales: {type: Number, required: true},
    tueSales: {type: Number, required: true},
    wedSales: {type: Number, required: true},
    thuSales: {type: Number, required: true},
    friSales: {type: Number, required: true},
    satSales: {type: Number, required: true},
    sunDate: {type: String, required: true, unique: true}, // format YYYYMMDD
    monDate: {type: String, required: true, unique: true},
    tueDate: {type: String, required: true, unique: true},
    wedDate: {type: String, required: true, unique: true},
    thuDate: {type: String, required: true, unique: true},
    friDate: {type: String, required: true, unique: true},
    satDate: {type: String, required: true, unique: true}     
});


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
function round(number, precision) {
    let shift = function (number, exponent) {
    let numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + exponent) : exponent));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database. 
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
    return round(totalGrossPay, 2);

});

laborWeekSchema.virtual('totalRegGrossPay').get(function() {
    const totalRegGrossPay = this.bakrsRegGrossPay +  
                this.csrvcRegGrossPay +
                this.drvrsRegGrossPay +
                this.jntrsRegGrossPay +
                this.pckrsRegGrossPay;
    return round(totalRegGrossPay, 2);
});

laborWeekSchema.virtual('totalOTGrossPay').get(function() {
    const totalOTGrossPay = this.bakrsOTGrossPay + 
                this.csrvcOTGrossPay +
                this.drvrsOTGrossPay +
                this.jntrsOTGrossPay +
                this.pckrsOTGrossPay;
    return round(totalOTGrossPay, 2);
});

laborWeekSchema.virtual('bakrsTotalGrossPay').get(function() {
    const bakrsTotalGrossPay = this.bakrsRegGrossPay + 
                this.bakrsOTGrossPay;
    return round(bakrsTotalGrossPay, 2);
});

laborWeekSchema.virtual('csrvcTotalGrossPay').get(function() {
    const csrvcTotalGrossPay = this.csrvcRegGrossPay + 
                this.csrvcOTGrossPay;
    return round(csrvcTotalGrossPay, 2);
});

laborWeekSchema.virtual('drvrsTotalGrossPay').get(function() {
    const drvrsTotalGrossPay = this.drvrsRegGrossPay + 
                this.drvrsOTGrossPay;
    return round(drvrsTotalGrossPay, 2);
});

laborWeekSchema.virtual('jntrsTotalGrossPay').get(function() {
    const jntrsTotalGrossPay = this.jntrsRegGrossPay + 
                this.jntrsOTGrossPay;
    return round(jntrsTotalGrossPay, 2);
});

laborWeekSchema.virtual('pckrsTotalGrossPay').get(function() {
    const pckrsTotalGrossPay = this.pckrsRegGrossPay + 
                this.pckrsOTGrossPay;
    return round(pckrsTotalGrossPay, 2);
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
    return round(totalHours, 2);
});

laborWeekSchema.virtual('totalRegHours').get(function() {
    const totalRegHours = this.bakrsRegHours +  
                this.csrvcRegHours +
                this.drvrsRegHours +
                this.jntrsRegHours +
                this.pckrsRegHours;
    return round(totalRegHours, 2);
});

laborWeekSchema.virtual('totalOTHours').get(function() {
    const totalOTHours = this.bakrsOTHours + 
                this.csrvcOTHours +
                this.drvrsOTHours +
                this.jntrsOTHours +
                this.pckrsOTHours;
    return round(totalOTHours, 2);
});

laborWeekSchema.virtual('bakrsTotalHours').get(function() {
    const bakrsTotalHours = this.bakrsRegHours + 
                this.bakrsOTHours;
    return round(bakrsTotalHours, 2);
});

laborWeekSchema.virtual('csrvcTotalHours').get(function() {
    const csrvcTotalHours = this.csrvcRegHours + 
                this.csrvcOTHours;
    return round(csrvcTotalHours, 2);
});

laborWeekSchema.virtual('drvrsTotalHours').get(function() {
    const drvrsTotalHours = this.drvrsRegHours + 
                this.drvrsOTHours;
    return round(drvrsTotalHours, 2);
});

laborWeekSchema.virtual('jntrsTotalHours').get(function() {
    const jntrsTotalHours = this.jntrsRegHours + 
                this.jntrsOTHours;
    return round(jntrsTotalHours, 2);
});

laborWeekSchema.virtual('pckrsTotalHours').get(function() {
    const pckrsTotalHours = this.pckrsRegHours + 
                this.pckrsOTHours;
    return round(pckrsTotalHours, 2);
});

salesWeekSchema.virtual('totalSales').get(function() {
    const totalSales =  this.sunSales + 
                this.monSales + 
                this.tueSales +
                this.wedSales +
                this.thuSales +
                this.friSales +
                this.satSales;
    return round(totalSales, 2);
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
    startDate: this.sunDate,
    sunSales: this.sunSales,
    monSales: this.monSales,
    tueSales: this.tueSales,
    wedSales: this.wedSales,
    thuSales: this.thuSales,
    friSales: this.friSales,
    satSales: this.satSales,
    sunDate: this.sunDate,
    monDate: this.monDate,
    tueDate: this.tueDate,
    wedDate: this.wedDate,
    thuDate: this.thuDate,
    friDate: this.friDate,
    satDate: this.satDate
    };
};

const LaborWeek = mongoose.model('LaborWeek', laborWeekSchema);

const SalesWeek = mongoose.model('SalesWeek', salesWeekSchema);

module.exports = {LaborWeek, SalesWeek};