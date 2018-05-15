function thisApp() {

	const SALESWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/salesWeeks';
	const LABORWEEKS_URL = 'https://fast-citadel-48845.herokuapp.com/laborWeeks';

	function getDataFromSalesWeeksApi(searchTerm, callback) {
    
	    const settings = {
	    	url: SALESWEEKS_URL,
	    	data: {
	     		'q': searchTerm
	    	},
	    	dataType: 'jsonp',
	    	type: 'GET',
	    	success: callback
	    };

	    $.ajax(settings);
	}

	function getDataFromLaborWeeksApi(searchTerm, callback) {
    
	    const settings = {
	    	url: LABORWEEKS_URL,
	    	data: {
	     		'q': searchTerm
	    	},
	    	dataType: 'jsonp',
	    	type: 'GET',
	    	success: callback
	    };

	    $.ajax(settings);
	}

	function watchSubmitSearch() {
    
	    clearInput();

	    $('.js-search-form').submit(event => {
	      event.preventDefault();
	      const queryTarget = $(event.currentTarget).find('.js-query');
	      const query = queryTarget.val();
	      getDataFromSalesWeeksApi(query, callbackGoesHere);
	      getDataFromLaborWeeksApi(query, callbackGoesHere);
	    });
	}

	function clearInput() {
    	$('.js-query').val("");
	}

	$(watchSubmitSearch);

}

thisApp();