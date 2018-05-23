'use strict';

function thisApp() {

	console.log('thisApp ran');

	const SALESWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/salesWeeks';
	const LABORWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/laborWeeks';
	let laborWeek;
	let salesWeek;

	function getDataFromSalesWeeksApi(weekID) {
    
		console.log('getDataFromSalesWeeksApi ran');

	    const settings = {
	    	url: `${SALESWEEKS_URL}/${weekID}`,
	    	dataType: 'json'
	    };

	    $.get(settings, processSalesWeekData)
	    	//.done(function () {
	    	//	console.log(`salesWeek is ${JSON.stringify(salesWeek)}`);
	    	//	console.log(`laborWeek is ${JSON.stringify(laborWeek)}`);
	    	//})
	    	//.done(unhideResultsDiv())
	    	.done(doSomeD3OneWeek());
	}

	function getDataFromLaborWeeksApi(weekID) {

	    const settings = {
	    	url: `${LABORWEEKS_URL}/${weekID}`,
	    	dataType: 'json'
	    };

	    $.get(settings, processLaborWeekData)
	    	.done(getDataFromSalesWeeksApi(weekID));
	}

	function processSalesWeekData(data) {

		salesWeek = data;

	}

	function processLaborWeekData(data) {

		laborWeek = data;

	}

	// create a data object for D3 containing only the gross pay totals for each dept
	function createGrossPayByDeptObj(salesWeek_, laborWeek_) {
		console.log(`salesWeek_ is ${JSON.stringify(salesWeek_)}`);
	   	console.log(`laborWeek_ is ${JSON.stringify(laborWeek_)}`);

		let grossPayByDeptData;
		if (salesWeek_.week_id === laborWeek_.week_id) { // only merge if both weeks are the same
			grossPayByDeptData.bakrsTotalGrossPay = laborWeek_.bakrsTotalGrossPay;
			grossPayByDeptData.csrvcTotalGrossPay = laborWeek_.csrvcTotalGrossPay;
			grossPayByDeptData.drvrsTotalGrossPay = laborWeek_.drvrsTotalGrossPay;
			grossPayByDeptData.jntrsTotalGrossPay = laborWeek_.jntrsTotalGrossPay;
			grossPayByDeptData.pckrsTotalGrossPay = laborWeek_.pckrsTotalGrossPay;
			return grossPayByDeptData;
		} else {
			console.log("salesWeek_.week_id does not match laborWeek_.week_id");
		}
	}

	function doSomeD3OneWeek() {

		unhideResultsDiv();

		// get data object
		const dataset = createGrossPayByDeptObj(salesWeek, laborWeek);

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

	function populateResultsToDOM(results_1) {
    	console.log('populateResultsToDOM ran');
    	$('.js-results').html(results_1);
    }

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
	      getDataFromLaborWeeksApi(query);

	      
	    });
	}

	function clearInput() {
    	console.log('clearInput ran');
    	$('.js-query').val("");
	}

	$(watchSubmitSearch);

}

thisApp();