'use strict';

const LABORWEEKS_URL = '/laborWeeks';

const postDataToLaborWeeksAPI = (data) => {

    console.log('postDataToLaborWeeksAPI ran');

    const settings = {
        url: `${LABORWEEKS_URL}`,
        data: data,
        success: () => {
            const successMessage = 'Your data has been successfully added';
            console.log(successMessage);
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${successMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ccffcc");
            $(':input').val("");
            $('button.remove').click( e => {
                $messageDiv.toggleClass('hidden');
            });
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.error('There has been an error in postDataToLaborWeeksAPI');
            const errorMessage = `That didn't work. ${jqXHR.responseJSON.message}.`;
            console.log(errorMessage);
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( e => {
                $messageDiv.toggleClass('hidden');
            });
        }
    };

    $.post(settings);

}

function ready() {
    
    $('form').submit( event => {
        event.preventDefault();
        console.log('Submit button clicked');

        var formDataArray = $(':input').serializeArray();

        console.log(formDataArray);

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

        console.log(formDataObj);

        postDataToLaborWeeksAPI(formDataObj);

    });
}

$(ready);