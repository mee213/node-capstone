'use strict'

const SALESWEEKS_URL = '/salesWeeks';
const LABORWEEKS_URL = '/laborWeeks';

const getDataFromAPIs = function(weekID) {

    /*
    return new Promise(function(resolve, reject) {
    */

        const getSalesWeek = getDataFromSalesWeeksAPI(weekID);

        const getLaborWeek = getDataFromLaborWeeksAPI(weekID);

        // returns responses (an array)
        return Promise.all([getSalesWeek, getLaborWeek]);

        /*
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
    */
}

const getDataFromSalesWeeksAPI = function(weekID) {

    return new Promise(function(resolve) {

        const settings = {
            url: `${SALESWEEKS_URL}/${weekID}`,
            dataType: 'json'
        };

        $.get(settings, function(data) {
            resolve(data);
        })
            .fail(function() {
                resolve(null);
            });
    });
}

const getDataFromLaborWeeksAPI = function(weekID) {

    return new Promise(function(resolve) {

        const settings = {
            url: `${LABORWEEKS_URL}/${weekID}`,
            dataType: 'json'
        };

        $.get(settings, function(data) {
            resolve(data);
        })
            .fail(function() {
                resolve(null);
            });
    });
}

function showButtons(responses) {
    let salesWeek = responses[0];
    let laborWeek = responses[1];

    console.log(salesWeek);
    console.log(laborWeek);

    if (salesWeek) {
        createButton('update', 'sales');
    } else {
        createButton('add', 'sales');
    }

    if (laborWeek) {
        createButton('update', 'labor');
    } else {
        createButton('add', 'labor');
    }

    return responses;
}

function createButton(action, page) {
    const pageTitleCase = page.charAt(0).toUpperCase() + page.slice(1);
    const actionTitleCase = action.charAt(0).toUpperCase() + action.slice(1);
    
    console.log(pageTitleCase);
    console.log(actionTitleCase);

    $('.js-buttons').append(`
        <a class="button" href="/add${pageTitleCase}?week_id=${weekID}">${actionTitleCase} ${pageTitleCase} Data</a>
    `);
}

function showReport() {
    if (!responses[0] || !responses[1]) {
        // give up
    } else {
        // show report
    }
}

function handleErrors() {

}

function loadSearchResults() {
    console.log('loadSearchResults ran');
    console.log(weekID);

    // get sales+labor from db
    // (could be existing data or null data for either, OR an error)
    getDataFromAPIs(weekID)
        .then(showButtons) // receives "responses" as data, then shows buttons depending on data status
        .then(showReport) // if all data exists
        .catch(handleErrors);
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
