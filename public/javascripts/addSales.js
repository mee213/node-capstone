'use strict';

const SALESWEEKS_URL = '/salesWeeks';

const postDataToSalesWeeksAPI = (data) => {

    const settings = {
        url: `${SALESWEEKS_URL}`,
        data: data,
        success: () => {
            const successMessage = 'Your data has been successfully added';
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${successMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ccffcc");
            $(':input').val("");
            $('form').get(0).reset()
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
        },
        error: (jqXHR) => {
            const errorMessage = `That didn't work. ${jqXHR.responseJSON.message}.`;
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
        }
    };

    $.post(settings);

}

function ready() {
    
    console.log(weekID);

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