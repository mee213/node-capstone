'use strict';

// for eslint
/* global weekID, 
   setCookie,
   doesDataExist,
   data_,
   disableInputFields,
   fillDates,
   convertToWeekPicker,
   clearDateFields,
   fields_ */

const SALESWEEKS_URL = '/salesWeeks';

const saveDataToSalesWeeksAPI = (data, method_) => {

    let thisURL = `${SALESWEEKS_URL}`;

    if (method_ === 'put') {
        thisURL += `/${weekID}`;
    }

    const settings = {
        url: thisURL,
        data: data,
        method: method_,
        success: () => {
            setCookie("success-message", `Sales data for week ${weekID} has been added`);
            location.replace(`searchResults/?week_id=${weekID}`);
        },
        error: (jqXHR) => {
            const errorMessage = `That didn't work. Unable to add sales data for week ${weekID} because: ${jqXHR.responseJSON.message}.`;
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">x</button>`);
            // message styling adapted from https://getbootstrap.com/docs/4.0/components/alerts/
            $messageDiv.css("background-color", "#f8d7da");
            $messageDiv.css("border-color", "#f5c6cb");
            $messageDiv.css("color", "#721c24");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
    };

    $.ajax(settings);

}

const ready = () => {

    const dataExists = doesDataExist(data_);  
    
    const $week_id = $('#week_id');
    const pageType = 'sales';
    
    // this will create an array of strings of the IDs of the date input fields
    // these strings are excluding the hash (#) sign
    const arrayOfDateInputIDs = [];
    for (let i = 0; i < fields_.length; ++i) {
        arrayOfDateInputIDs.push(fields_[i].date);
    }

    if (dataExists) { // if searched by week_id and found existing data
        $('h1').text("Update Sales Data");
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#sunSales').focus();
    } else if (weekID) { // if searched by week_id and no data was found
        $week_id.val(weekID);
        fillDates(weekID, arrayOfDateInputIDs, pageType);
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#sunSales').focus();
    } else { // if coming from 'Add' link in menu nav bar, ie, week_id still blank
        convertToWeekPicker($week_id);
        $week_id.blur( () => {
            if ($week_id.val()) {
                fillDates($week_id.val(), arrayOfDateInputIDs, pageType);
                $('#sunSales').focus();
                disableInputFields(arrayOfDateInputIDs);
            } else {
                clearDateFields(arrayOfDateInputIDs);
            } 
        });
    }

    $('form').submit( event => {
        event.preventDefault();

        var disabled = $(':input:disabled').removeAttr('disabled');
        var formDataArray = $(':input').serializeArray();
        disabled.attr('disabled','disabled');

        // we have an array of objects, 
        //var myArray = [ { name: 'a', value: 1 }, { name: 'b', value: 2 }, { name: 'c', value: 3 } ];
        // we want an object like { a: 1, b: 2, c: 3 }

        // accumulator is an object, we'll set it to an empty object
        // initially, when we call the reducer

        // currentValue is the value of the current array element. 
        function reducer(accumulator, currentValue) {
            if (currentValue.name == "sunSales" || currentValue.name == "monSales" || currentValue.name == "tueSales" || currentValue.name == "wedSales" || currentValue.name == "thuSales" || currentValue.name == "friSales" || currentValue.name == "satSales") {
                accumulator[currentValue.name] = parseFloat(currentValue.value);
            } else {
                accumulator[currentValue.name] = currentValue.value;
            }

            return accumulator;
        }

        var formDataObj = formDataArray.reduce(reducer, {});

        saveDataToSalesWeeksAPI(formDataObj, dataExists ? 'put' : 'post');

    });
}

$(ready);