'use strict';

// gets any parameter from the URL (send in the name of the desired param as argument)
// from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html  
const getURLParameter = sParam => {
    console.log('getURLParameter() ran');
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
};

// returns true or false if data exists in database or not for given sales or labor week
const doesDataExist = data => {

    console.log('doesDataExist() ran');

    let dataExists_;

    if (typeof data === "string") {
        dataExists_ = false;
      } else {
        dataExists_ = true;
      } 
    
    console.log(dataExists_);

    return dataExists_;
}

// send an array like ['someID', 'someOtherID', ...]
// do not include the hashes(#) in the array, hash(#) is added below
const disableInputFields = arrayOfInputIDs => {
    for (let i = 0; i < arrayOfInputIDs.length; i++) {
        $(`#${arrayOfInputIDs[i]}`).prop('disabled', true);
    }
}

const fillDates = (week_id) => {

    const year = week_id.substring(0, 4);
    const week = week_id.substring(4, 6);
    console.log('The year is: ' + year);
    console.log('The week is: ' + week);

    const getFirstPaydayOfYear = year_ => {

        // index of payday (0-6 for Sunday through Saturday)
        const payday = 5; // 5 means payday happens each Friday

        // payday has to be 0-6 to make sense
        if (payday < 0 || payday > 6) {
            throw new Error('Payday has to be between 0 and 6.');
        } 

        // loop through first 7 days of the year looking for the first payday
        for (let i = 1; i <= 7; i++) {
            
            const d = new Date(year_, 0, i);
            const day = d.getDay();

            if (day === payday) {
                return d;
            }
        }
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

      