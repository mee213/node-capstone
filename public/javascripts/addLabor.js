'use strict';

const LABORWEEKS_URL = '/laborWeeks';

const saveDataToLaborWeeksAPI = (data, method_) => {

    let thisURL = `${LABORWEEKS_URL}`;

    if (method_ === 'put') {
        thisURL += `/${weekID}`;
    }

    const settings = {
        url: thisURL,
        data: data,
        method: method_,
        success: () => {
            location.replace(`searchResults/?week_id=${weekID}`);
            // const successMessage = `Labor data for week ${data.week_id} has been successfully added`;
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
            const errorMessage = `That didn't work. Unable to add labor data for week ${weekID} because: ${jqXHR.responseJSON.message}.`;
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

    $.ajax(settings);
}

const ready = () => {
    
    const dataExists = doesDataExist(data_);  
    console.log('dataExists? ' + dataExists);

    const $week_id = $('#week_id');
    const pageType = 'labor';

    //there is only one date on this page, but needs to be in an array
    const arrayOfDateInputIDs = ['periodEndDate'];
    
    if (dataExists) { // if searched by week_id and found existing data
        $('h1').text("Update Labor Data");
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#bakrsRegHours').focus();
    } else if (weekID) { // if searched by week_id and no data was found
        console.log(weekID);
        $week_id.val(weekID);
        fillDates(weekID, arrayOfDateInputIDs, pageType);
        disableInputFields(['week_id']);
        disableInputFields(arrayOfDateInputIDs);
        $('#bakrsRegHours').focus();
    } else { // if coming from 'Add' link in menu nav bar, ie, week_id still blank
        convertToWeekPicker($week_id);
        $week_id.blur( event => {
            if ($week_id.val()) {
                fillDates($week_id.val(), arrayOfDateInputIDs, pageType);
                $('#bakrsRegHours').focus();
                disableInputFields(arrayOfDateInputIDs);
            } else {
                clearDateFields(arrayOfDateInputIDs);
            } 
        });
    }

    console.log('dataExists?');
    console.log(dataExists);

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
            if (currentValue.name == "week_id" || currentValue.name == "periodEndDate") {
                accumulator[currentValue.name] = currentValue.value;
            } else {
                accumulator[currentValue.name] = parseFloat(currentValue.value);
            }

            return accumulator;
        }

        var formDataObj = formDataArray.reduce(reducer, {});

        saveDataToLaborWeeksAPI(formDataObj, dataExists ? 'put' : 'post');

    });
}

$(ready);