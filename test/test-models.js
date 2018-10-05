'use strict';

const chai = require('chai');
const mongoose = require('mongoose');

const {LaborWeek, SalesWeek} = require('../models');

const laborSeedData = require('../labor-seed-data.json');
const salesSeedData = require('../sales-seed-data.json');

const expect = chai.expect;

describe('Labor Weeks Model', function() {
// "it" for each virtual and method

	// testing the virtual for totalGrossPay
	it('should calculate totalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalGrossPay).to.equal(47671.52);
	});

	// testing the virtual for totalRegGrossPay
	it('should calculate totalRegGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalRegGrossPay).to.equal(41882.47);
	});

	// testing the virtual for totalOTGrossPay
	it('should calculate totalOTGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalOTGrossPay).to.equal(5789.05);
	});

	// testing the virtual for bakrsTotalGrossPay
	it('should calculate bakrsTotalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.bakrsTotalGrossPay).to.equal(21089.21);
	});

	// testing the virtual for csrvcTotalGrossPay
	it('should calculate csrvcTotalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.csrvcTotalGrossPay).to.equal(1838.99);
	});

	// testing the virtual for drvrsTotalGrossPay
	it('should calculate drvrsTotalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.drvrsTotalGrossPay).to.equal(9710.51);
	});

	// testing the virtual for jntrsTotalGrossPay
	it('should calculate jntrsTotalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.jntrsTotalGrossPay).to.equal(4891.18);
	});

	// testing the virtual for pckrsTotalGrossPay
	it('should calculate pckrsTotalGrossPay', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.pckrsTotalGrossPay).to.equal(10141.63);
	});

	// testing the virtual for totalHours
	it('should calculate totalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalHours).to.equal(3868.7);
	});

	// testing the virtual for totalRegHours
	it('should calculate totalRegHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalRegHours).to.equal(3557.22);
	});

	// testing the virtual for totalOTHours
	it('should calculate totalOTHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.totalOTHours).to.equal(311.48);
	});

	// testing the virtual for bakrsTotalHours
	it('should calculate bakrsTotalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.bakrsTotalHours).to.equal(1577.32);
	});

	// testing the virtual for csrvcTotalHours
	it('should calculate csrvcTotalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.csrvcTotalHours).to.equal(121.86);
	});

	// testing the virtual for drvrsTotalHours
	it('should calculate drvrsTotalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.drvrsTotalHours).to.equal(766.51);
	});

	// testing the virtual for jntrsTotalHours
	it('should calculate jntrsTotalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.jntrsTotalHours).to.equal(416.21);
	});

	// testing the virtual for pckrsTotalHours
	it('should calculate pckrsTotalHours', function() {
		let laborTestWeek = new LaborWeek(laborSeedData[0]);
		expect(laborTestWeek.pckrsTotalHours).to.equal(986.8);
	});

	// testing the serialize method
	it('should serialize', function() {

		let laborTestWeek = new LaborWeek(laborSeedData[0]);

		const serializedLaborWeek = { 
			week_id: '201610',
			periodEndDate: '20160304',
			totalHours: 3868.7,
			totalRegHours: 3557.22,
			totalOTHours: 311.48,
			totalGrossPay: 47671.52,
			totalRegGrossPay: 41882.47,
			totalOTGrossPay: 5789.05,
			bakrsTotalHours: 1577.32,
			bakrsRegHours: 1421.57,
			bakrsOTHours: 155.75,
			bakrsTotalGrossPay: 21089.21,
			bakrsRegGrossPay: 18193.55,
			bakrsOTGrossPay: 2895.66,
			csrvcTotalHours: 121.86,
			csrvcRegHours: 115.49,
			csrvcOTHours: 6.37,
			csrvcTotalGrossPay: 1838.99,
			csrvcRegGrossPay: 1695.66,
			csrvcOTGrossPay: 143.33,
			drvrsTotalHours: 766.51,
			drvrsRegHours: 662.49,
			drvrsOTHours: 104.02,
			drvrsTotalGrossPay: 9710.51,
			drvrsRegGrossPay: 7703.29,
			drvrsOTGrossPay: 2007.22,
			jntrsTotalHours: 416.21,
			jntrsRegHours: 402.88,
			jntrsOTHours: 13.33,
			jntrsTotalGrossPay: 4891.18,
			jntrsRegGrossPay: 4649.4,
			jntrsOTGrossPay: 241.78,
			pckrsTotalHours: 986.8,
			pckrsRegHours: 954.79,
			pckrsOTHours: 32.01,
			pckrsTotalGrossPay: 10141.63,
			pckrsRegGrossPay: 9640.57,
			pckrsOTGrossPay: 501.06 
		};
		
		expect(laborTestWeek.serialize()).to.deep.equal(serializedLaborWeek);
	})
});

describe('Sales Weeks Model', function() {
// "it" for each virtual and method

	// testing the virtual for totalSales
	it('should calculate totalSales', function() {
		let salesTestWeek = new SalesWeek(salesSeedData[0]);
		expect(salesTestWeek.totalSales).to.equal(144930);
	});

	// testing the serialize method
	it('should serialize', function() {

		let salesTestWeek = new SalesWeek(salesSeedData[0]);

		const serializedSalesWeek = { 
			week_id: '201610',
			totalSales: 144930,
			startDate: '20160228',
		};
		
		expect(salesTestWeek.serialize()).to.deep.equal(serializedSalesWeek);
	})
});

