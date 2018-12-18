'use strict';
/*






function clearMessage($aMessageDiv) {
    $aMessageDiv.html('');
    $aMessageDiv.addClass('hidden');
}
*/
// if user has already filled in the search box but not submitted yet,
// and they reload the page, the search box will refresh to be empty
function clearInput() {
    $('.js-query').val("");
}

$(clearInput);


