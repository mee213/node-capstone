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
			})

		if (grossPayByDept != undefined) {
			resolve (grossPayByDept);
		} else {
			reject(Error("There has been an error in getDataFromAPIs"));
		}
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
	    	sales_Week = data;
	    	console.log(`sales_Week is ${sales_Week}`);
	    });

	    if (sales_Week != undefined) {
	    	resolve (sales_Week);
	    } else {
	    	reject(Error("There has been an error in getDataFromSalesWeeksAPI"));
	    }

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
	    	labor_Week = data;
	    	console.log(`labor_Week is ${labor_Week}`);
	    });

	    if (labor_Week != undefined) {
	    	resolve (labor_Week);
	    } else {
	    	reject(Error("There has been an error in getDataFromLaborWeeksAPI"));
	    }

	})
}

// create a data object for D3 containing only the gross pay totals for each dept
function createGrossPayByDeptObj(salesWeek_, laborWeek_) {

	let salesWeek1 = salesWeek_;
	let laborWeek1 = laborWeek_;

	let grossPayByDeptData;

	if (salesWeek1.week_id === laborWeek1.week_id) { // only merge if both weeks are the same
		console.log('this happened');
		grossPayByDeptData.bakrsTotalGrossPay = laborWeek1.bakrsTotalGrossPay;
		grossPayByDeptData.csrvcTotalGrossPay = laborWeek1.csrvcTotalGrossPay;
		grossPayByDeptData.drvrsTotalGrossPay = laborWeek1.drvrsTotalGrossPay;
		grossPayByDeptData.jntrsTotalGrossPay = laborWeek1.jntrsTotalGrossPay;
		grossPayByDeptData.pckrsTotalGrossPay = laborWeek1.pckrsTotalGrossPay;
		return grossPayByDeptData;
	} else {
		console.log("salesWeek1.week_id does not match laborWeek1.week_id");
	}
}

function doSomeD3(data) {

	unhideResultsDiv();

	// get data object
	const dataset = data;

	//Width and height
	let w = 500;
	let h = 300;
	let padding = 20;

	//Create scale functions
	//var xScale = d3.scaleLinear()
	//					 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
	//					 .range([padding, w - padding * 2]);

	//var yScale = d3.scaleLinear()
	//					 .domain([0, d3.max(dataset, function(d) { return d[1]; })])
	//					 .range([h - padding, padding]);

	//Create SVG element
	let svg = d3.select(".js-results")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	svg.selectAll("rect")
		.data(dataset)
		.enter()
		.append("rect")
		.attr("x", function(d, i) {
			return i * (w/ dataset.length);
		})
		.attr("y", function(d) {
			return h - (d * 4);
		})
		.attr("width", w / dataset.length - barPadding)
	   	.attr("height", function(d) {
	   		return d * 4;
	  	 })
	   	.attr("fill", function(d) {
			return "rgb(0, 0, " + Math.round(d * 10) + ")";
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


