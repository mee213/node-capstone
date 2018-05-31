'use strict';

const SALESWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/salesWeeks';
const LABORWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/laborWeeks';

const getDataFromAPIs = function(weekID) {

	return new Promise(function(resolve, reject) {

		const getSalesWeek = getDataFromSalesWeeksAPI(weekID);

		const getLaborWeek = getDataFromLaborWeeksAPI(weekID);

		const getSalesAndLaborWeeks = Promise.all([getSalesWeek, getLaborWeek]);

		let grossPayByDept;

		getSalesAndLaborWeeks
			.then(function(responses) {
				let salesWeek = responses[0];
				let laborWeek = responses[1];
				grossPayByDept = createGrossPayByDeptObj(salesWeek, laborWeek);
				if (grossPayByDept != undefined) {
					resolve (grossPayByDept);
				} else {
					reject(Error("There has been an error in getDataFromAPIs"));
				}
			});
	});
}

const getDataFromSalesWeeksAPI = function(weekID) {

	return new Promise(function(resolve, reject) {

		let sales_Week;

	    const settings = {
	    	url: `${SALESWEEKS_URL}/${weekID}`,
	    	dataType: 'json'
	    };

	    $.get(settings, function(data) {
	    	resolve(data);
	    })
	    	.fail(function() {
	    		console.error("There has been an error in getDataFromSalesWeeksAPI");
	    	});
	});
}

const getDataFromLaborWeeksAPI = function(weekID) {

	return new Promise(function(resolve, reject) {

		let labor_Week;

	    const settings = {
	    	url: `${LABORWEEKS_URL}/${weekID}`,
	    	dataType: 'json'
	    };

	    $.get(settings, function(data) {
	    	resolve(data);
	    })
	    	.fail(function() {
	    		console.error("There has been an error in getDataFromLaborWeeksAPI");
	    	});
	});
}

// create a data object for D3 containing only the gross pay totals for each dept
function createGrossPayByDeptObj(salesWeek_, laborWeek_) {

	let salesWeek1 = salesWeek_;
	let laborWeek1 = laborWeek_;

	let grossPayByDeptData = {};

	if (salesWeek1.week_id === laborWeek1.week_id) { // only merge if both weeks are the same
		console.log('this happened');
		console.log(laborWeek1);
		console.log(salesWeek1);
		grossPayByDeptData.bakrsTotalGrossPay = laborWeek1.bakrsTotalGrossPay;
		grossPayByDeptData.csrvcTotalGrossPay = laborWeek1.csrvcTotalGrossPay;
		grossPayByDeptData.drvrsTotalGrossPay = laborWeek1.drvrsTotalGrossPay;
		grossPayByDeptData.jntrsTotalGrossPay = laborWeek1.jntrsTotalGrossPay;
		grossPayByDeptData.pckrsTotalGrossPay = laborWeek1.pckrsTotalGrossPay;
		grossPayByDeptData.totalSales = salesWeek1.totalSales;
		console.log(grossPayByDeptData);
		return grossPayByDeptData;
	} else {
		console.log("salesWeek1.week_id does not match laborWeek1.week_id");
	}
}

function doSomeD3(data) {

	unhideResultsDiv();

	// extract labor data into its own object, put sales data in a separate variable
	const dataset = [];

	dataset[0] = data.bakrsTotalGrossPay;
	dataset[1] = data.csrvcTotalGrossPay;
	dataset[2] = data.drvrsTotalGrossPay;
	dataset[3] = data.jntrsTotalGrossPay;
	dataset[4] = data.pckrsTotalGrossPay;

	const totalSales = data.totalSales;

	console.log(dataset);
	console.log(totalSales);

	//Width and height
	let svgWidth = 500;
	let svgHeight = 500;
	let barWidth = 20;
	let centeredX = svgWidth/2-barWidth/2;
	

	//Create scale functions
	

	var yScale = d3.scaleLinear()
							.domain([0, totalSales])
							.rangeRound([0, svgHeight])
							.nice();

	//Create SVG element
	let svg = d3.select(".js-results")
				.append("svg")
				.attr("width", svgWidth)
				.attr("height", svgHeight);

	// background rectangle represents totalSales
	svg.append("rect")
		.classed("sales", true) // add sales class to the sales rectangle
		.attr("x", centeredX)
		.attr("y", 0)
		.attr("width", barWidth)
		.attr("height", yScale(totalSales))
		.attr("fill", "gray");

	//Create bars
	svg.selectAll("rect:not(.sales)") // select all rectangles except those with sales class
	   .data(dataset)
	   .enter()
	   .append("rect")
	   .attr("x", centeredX) // center the bar inside the svg space
	   .attr("y", function(d) {
	   		return yScale(d);
	   })
	   .attr("width", barWidth)
	   .attr("height", function(d) {
	   		return yScale(d);
	   	});

	 
	

}
/*
function populateResultsToDOM(results_1) {
	console.log('populateResultsToDOM ran');
	$('.js-results').html(results_1);
}
*/
function unhideResultsDiv() {
	console.log('unhideResultsDiv ran');
	$('.js-results').prop('hidden', false);
}

function watchSubmitSearch() {

	console.log('watchSubmitSearch ran');

    clearInput();

    $('.js-search-form').submit(event => {
      event.preventDefault();
      console.log('Search button clicked');
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      getDataFromAPIs(query)
      	.then(doSomeD3)
      	.catch(err => console.error(err));
      
    });
}

function clearInput() {
	console.log('clearInput ran');
	$('.js-query').val("");
}

$(watchSubmitSearch);


