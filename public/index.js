function thisApp() {

	console.log('thisApp ran');

	const SALESWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/salesWeeks';
	const LABORWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/laborWeeks';

	function getDataFromSalesWeeksApi(weekID) {
    
		console.log('getDataFromSalesWeeksApi ran');

	    let url = `${SALESWEEKS_URL}/${weekID}`;
	    console.log(`The url is ${url}`);

	    $.get(url)
	    	.done(processSalesWeekData(data));
	}

	function getDataFromLaborWeeksApi(weekID, callback) {
    
		console.log('getDataFromLaborWeeksApi ran');

	    const settings = {
	    	url: `${LABORWEEKS_URL}/${weekID}`,
	    	dataType: 'json',
	    	type: 'GET',
	    	success: callback
	    };

	    $.ajax(settings);
	}

	function processSalesWeekData(data) {

		console.log('processSalesWeekData ran');
		console.log(`The weekID is ${data.week_id}`);

	}

	function processLaborWeekData(data) {

		console.log('processLaborWeekData ran');
		console.log(data);

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
	      getDataFromSalesWeeksApi(query);
	      getDataFromLaborWeeksApi(query, processLaborWeekData);
	    });
	}

	function clearInput() {
    	console.log('clearInput ran');
    	$('.js-query').val("");
	}

	$(watchSubmitSearch);

}

thisApp();