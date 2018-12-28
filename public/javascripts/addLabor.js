'use strict';

const LABORWEEKS_URL = '/laborWeeks';

const postDataToLaborWeeksAPI = (data) => {

    const settings = {
        url: `${LABORWEEKS_URL}`,
        data: data,
        success: () => {
            const successMessage = `Labor data for week ${data.week_id} has been successfully added`;
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${successMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ccffcc");
            $(':input').val("");
            $('form').get(0).reset()
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        },
        error: (jqXHR) => {
            const errorMessage = `That didn't work. Unable to add labor data for week ${data.week_id} because: ${jqXHR.responseJSON.message}.`;
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

function ready() {
    
    console.log(weekID);
    
    if (dataExists) {
        $('h1').text("Update Labor Data");
    } else {
        $('#week_id').val(weekID);
    }

    console.log('dataExists?');
    console.log(dataExists);

    $('form').submit( event => {
        event.preventDefault();

        var formDataArray = $(':input').serializeArray();

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

        postDataToLaborWeeksAPI(formDataObj);

    });
}

$(ready);