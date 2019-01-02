'use strict';

const SALESWEEKS_URL = '/salesWeeks';

const postDataToSalesWeeksAPI = (data) => {

    const settings = {
        url: `${SALESWEEKS_URL}`,
        data: data,
        success: () => {
            const successMessage = `Sales data for week ${data.week_id} has been successfully added`;
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
            const errorMessage = `That didn't work. Unable to add sales data for week ${data.week_id} because: ${jqXHR.responseJSON.message}.`;
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

const fillDates = (week_id) => {

    const year = week_id.substring(0, 4);
    const week = week_id.substring(4, 6);
    console.log('The year is: ' + year);
    console.log('The week is: ' + week);

    const getFirstPaydayOfYear = year_ => {

        // index of payday (0-6 for Sunday through Saturday)
        const payday = 5; // 5 means payday happens each Friday

        // loop through first 7 days of the year looking for the first payday
        for (let i = 1; i <= 7; i++) {
            
            const d = new Date(year_, 0, i);
            const day = d.getDay();

            if (day === payday) {
                return d;
            }
        }

        // return an error here if payday const isn't a value from 0-6??
    }

    const getDatesArray = (year_, week_) => {

        const firstPaydayFullDate = new Date(getFirstPaydayOfYear(year_));
        console.log('The first payday of ' + year_ + ' is ' + firstPaydayFullDate);
        const firstPaydayDayIndex = firstPaydayFullDate.getDay();
        console.log('The index of the first payday Day is ' + firstPaydayDayIndex);
        const firstPaydayDateIndex = firstPaydayFullDate.getDate();

        
        const thisPaydayFullDate = new Date(firstPaydayFullDate.setDate(firstPaydayDateIndex + (7 * (week_ - 1))));
        const thisPaydayDayIndex = thisPaydayFullDate.getDay();
        const thisPaydayDateIndex = thisPaydayFullDate.getDate();
        
        // assumes that pay period end date is always seven days prior to payday
        const payPeriodEndsXDaysPriorToPayday = 7;
        const payPeriodEndFullDate = new Date(thisPaydayFullDate.setDate(thisPaydayDateIndex - payPeriodEndsXDaysPriorToPayday));
        console.log('payPeriodEndDate is ' + payPeriodEndFullDate);
        const payPeriodEndDayIndex = payPeriodEndFullDate.getDay();
        console.log('The index of the period end date Day is ' + payPeriodEndDayIndex);
        const payPeriodEndDateIndex = payPeriodEndFullDate.getDate();

        const defaultOffset = [-1, 0, 1, 2, 3, 4, 5, 6];
        const datesArray_ = [];

        // create a different offset array depending on day of week that payday falls
        for (let dayIndex = 0; dayIndex <= 6; dayIndex++) {
            if (payPeriodEndDayIndex === dayIndex) {
                const thisOffset = defaultOffset.map(num => {
                    return num - dayIndex;
                })

                console.log('The offset array for a ' + dayIndex + ' payday is ' + thisOffset);

                // create an array of 8 dates, beginning and ending with Saturday, containing payday
                for (let i = 0; i <= 7; i++) {
                    const offset = thisOffset[i];
                    console.log('offset is ' + offset);
                    const thisYear = payPeriodEndFullDate.getFullYear();
                    const thisMonth = payPeriodEndFullDate.getMonth();
                    const thisDay = payPeriodEndDateIndex + offset;
                    const thisDate = new Date(thisYear, thisMonth, thisDay);
                    console.log('thisDate is ' + thisDate);
                    datesArray_.push(thisDate);
                }
            }
        }

        console.log('The first Saturday is ' + datesArray_[0]);

        return datesArray_;
    }

    const datesArray = getDatesArray(year, week);
    console.log(datesArray);

    const $sunDate = $('#sunDate');
    const $monDate = $('#monDate');
    const $tueDate = $('#tueDate');
    const $wedDate = $('#wedDate');
    const $thuDate = $('#thuDate');
    const $friDate = $('#friDate');
    const $satDate = $('#satDate');

    // set the input fields to show correct dates (in correct format)
    // for the sales week, the 7 days correspond to the
    // indexes 1-7 in the datesArray, whereas for the
    // labor week, the 7 days correspond to the indexes 0-6
    $sunDate.val(moment(datesArray[1]).format('YYYYMMDD'));
    $monDate.val(moment(datesArray[2]).format('YYYYMMDD'));
    $tueDate.val(moment(datesArray[3]).format('YYYYMMDD'));
    $wedDate.val(moment(datesArray[4]).format('YYYYMMDD'));
    $thuDate.val(moment(datesArray[5]).format('YYYYMMDD'));
    $friDate.val(moment(datesArray[6]).format('YYYYMMDD'));
    $satDate.val(moment(datesArray[7]).format('YYYYMMDD'));
}

const disableDateInputs = () => {
    const $sunDate = $('#sunDate');
    const $monDate = $('#monDate');
    const $tueDate = $('#tueDate');
    const $wedDate = $('#wedDate');
    const $thuDate = $('#thuDate');
    const $friDate = $('#friDate');
    const $satDate = $('#satDate');

    $sunDate.prop('disabled', true);
    $monDate.prop('disabled', true);
    $tueDate.prop('disabled', true);
    $wedDate.prop('disabled', true);
    $thuDate.prop('disabled', true);
    $friDate.prop('disabled', true);
    $satDate.prop('disabled', true);
}

const disableWeekID = () => {
    const $week_id = $('#week_id');
    $week_id.prop('disabled', true);
}

const ready = () => {
    
    const $week_id = $('#week_id');

    if (dataExists) { // if searched by week_id and found existing data
        $('h1').text("Update Sales Data");
        disableWeekID();
        disableDateInputs();
    } else if (weekID) { // if searched by week_id and no data was found
        console.log(weekID);
        $week_id.val(weekID);
        fillDates(weekID);
        $('#sunSales').focus();
        disableDateInputs();
        $week_id.blur( event => {
            fillDates($week_id.val());
            $('#sunSales').focus();
        });
    } else { // if coming from 'Add' link in menu nav bar, ie, no week_id yet
        $week_id.blur( event => {
            fillDates($week_id.val());
            $('#sunSales').focus();
            disableDateInputs();
        });
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