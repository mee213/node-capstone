'use strict';

// for eslint
/* global convertToWeekPicker */


function main() {
    const $search = $('#search');
    
    // if user has already filled in the search box but not submitted yet,
    // and they reload the page, the search box will refresh to be empty
    $search.val("");

    // search input field will have a pop-up calendar week picker
    convertToWeekPicker($search);

   
}

$(main);


