'use strict'

function loadSearchResults() {
    console.log('loadSearchResults ran');
    console.log(weekID);
}

$(loadSearchResults);







/* some code brought over from index.js - might use later

      //grab input, save input, then clear input
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      

      //clear results div in case of previous results displayed
      $('.js-results').html('');

      //clear all messages in case of previous message 
      clearMessage($('.js-message'));
      clearMessage($('.js-message-labor'));
      clearMessage($('.js-message-sales'));

      getDataFromAPIs(query)
        .then(doSomeD3)
        .catch( () => {
            const errorMessage = 'Cannot search without a week number.';
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
        });
*/
