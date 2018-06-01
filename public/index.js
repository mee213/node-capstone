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
	const totalGrossPayByDept = [];

	// typically this order will reflect greatest to least, i.e. bakers > packers > drivers, etc
	totalGrossPayByDept[0] = data.bakrsTotalGrossPay; // totalGrossPayByDept[0] = bakers
	totalGrossPayByDept[1] = data.pckrsTotalGrossPay; // totalGrossPayByDept[1] = packers
	totalGrossPayByDept[2] = data.drvrsTotalGrossPay; // totalGrossPayByDept[2] = drivers
	totalGrossPayByDept[3] = data.jntrsTotalGrossPay; // totalGrossPayByDept[3] = janitors
	totalGrossPayByDept[4] = data.csrvcTotalGrossPay; // totalGrossPayByDept[4] = customer service
	
	const totalSales = data.totalSales;

	console.log(totalGrossPayByDept);
	console.log(totalSales);

	//Width and height
	let svgWidth = 500;
	let svgHeight = 600;
	let barWidth = 300;
	let centeredX = svgWidth/2-barWidth/2;
	

	//Create scale functions
	let yScale = d3.scaleLinear()
					.domain([0, totalSales])
					.rangeRound([0, svgHeight]);

	let arrayOfGoalPercents = [ 14.0, 7.0, 7.0, 3.0, 2.0 ];
	let arrayOfActualPercents = [];
	let arrayOfFillColors = [];
	let arrayOfYs = [];
	let totalY = 0;
	let passingFillColor = "palegreen";
	let failingFillColor = "salmon";

	for (let i = 0; i < totalGrossPayByDept.length; i++) {
    	totalY += yScale(totalGrossPayByDept[i]);
    	arrayOfYs.push(totalY);
	} 

	for (let i = 0; i < totalGrossPayByDept.length; i++) {
		arrayOfActualPercents.push(totalGrossPayByDept[i]/totalSales*100);
	}

	for (let i = 0; i < totalGrossPayByDept.length; i++) {
		if (arrayOfActualPercents[i] <= arrayOfGoalPercents[i]) {
			arrayOfFillColors.push(passingFillColor);
		} else {
			arrayOfFillColors.push(failingFillColor);
		}
	}

	console.log(arrayOfYs);
	console.log(arrayOfActualPercents);
	console.log(arrayOfFillColors);

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
		.attr("fill", "papayaWhip")
		.append("text")
		.classed("sales", true)
		.text("$" + totalSales.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'))
		.attr("font-family", "sans-serif")
	   	.attr("font-size", "11px")
	   	.attr("fill", "black")
	   	.attr("text-anchor", "middle")
	   	.attr("x", centeredX + barWidth/2)
	   	.attr("y", 100);

	//Create bars representing each department's labor
	svg.selectAll("rect:not(.sales)") // select all rectangles except those with sales class
	   .data(totalGrossPayByDept)
	   .enter()
	   .append("rect")
	   .attr("x", centeredX) // center the bar inside the svg space
	   .attr("y", function(d, i) {
	   		return svgHeight - arrayOfYs[i];
	   })
	   .attr("width", barWidth)
	   .attr("height", function(d) {
	   		return yScale(d);
	   	})
	   .attr("fill", function(d, i) {
	   		return arrayOfFillColors[i];
	   });

	svg.selectAll("text:not(.sales)")
	   .data(totalGrossPayByDept)
	   .enter()
	   .append("text")
	   .text(function(d, i) {
	   		return arrayOfActualPercents[i].toFixed(2) + "%";
	   })
	   .attr("dominant-baseline", "middle")
	   .attr("text-anchor", "middle")
	   .attr("x", centeredX + barWidth/2)
	   .attr("y", function(d, i) {
	   		return svgHeight - arrayOfYs[i] + yScale(d)/2;
	   })
	   .attr("font-family", "sans-serif")
	   .attr("font-size", "11px")
	   .attr("fill", "white");

	 
	

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


