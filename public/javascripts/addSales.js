'use strict';

const SALESWEEKS_URL = '/salesWeeks';

const postDataToSalesWeeksAPI = (data) => {

    const settings = {
        url: `${SALESWEEKS_URL}`,
        data: data,
        success: () => {
            location.replace(`searchResults/?week_id=${weekID}`);
            // const successMessage = `Sales data for week ${data.week_id} has been successfully added`;
            // const $messageDiv = $('.js-message');
            // $messageDiv.removeClass('hidden');
            // $messageDiv.html(`<p>${successMessage}</p><button type="button" class="remove">X</button>`);
            // $messageDiv.css("background-color", "#ccffcc");
            // $(':input').val("");
            // $('form').get(0).reset()
            // $('button.remove').click( () => {
            //     $messageDiv.toggleClass('hidden');
            // });
            // $('html, body').animate({ scrollTop: 0 }, 'slow');
        },
        error: (jqXHR) => {
            console.log(jqXHR);
            const errorMessage = `That didn't work. Unable to add sales data for week ${weekID} because: ${jqXHR.responseJSON.message}.`;
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
    };

    $.post(settings);

}

const ready = () => {

    const dataExists = doesDataExist(data_);  
    console.log('dataExists? ' + dataExists);
    
    const $week_id = $('#week_id');
    const pageType = 'sales';
    
    // this will create an array of strings of the IDs of the date input fields
    // these strings are excluding the hash (#) sign
    const arrayOfDateInputIDs = [];
    for (let i = 0; i < fields_.length; ++i) {
        arrayOfDateInputIDs.push(fields_[i].date);
    }

    console.log(arrayOfDateInputIDs);

    if (dataExists) { // if searched by week_id and found existing data
        $('h1').text("Update Sales Data");
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#sunSales').focus();
    } else if (weekID) { // if searched by week_id and no data was found
        console.log(weekID);
        $week_id.val(weekID);
        fillDates(weekID, arrayOfDateInputIDs, pageType);
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#sunSales').focus();
    } else { // if coming from 'Add' link in menu nav bar, ie, week_id still blank
        convertToWeekPicker($week_id);
        $week_id.blur( event => {
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

        postDataToSalesWeeksAPI(formDataObj);

    });
}

$(ready);