'use strict';

// gets any parameter from the URL (send in the name of the desired param as argument)
// from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html  
// eslint-disable-next-line no-unused-vars
const getURLParameter = sParam => {
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
// eslint-disable-next-line no-unused-vars
const doesDataExist = data => {

    let dataExists_;

    if (data.week_id) {
        dataExists_ = true;
      } else {
        dataExists_ = false;
      } 

    return dataExists_;
}

// send an array like ['someID', 'someOtherID', ...]
// do not include the hashes(#) in the array, hash(#) is added below
// eslint-disable-next-line no-unused-vars
const disableInputFields = arrayOfInputIDs => {
    for (let i = 0; i < arrayOfInputIDs.length; i++) {
        $(`#${arrayOfInputIDs[i]}`).prop('disabled', true);
    }
}

// eslint-disable-next-line no-unused-vars
const clearDateFields = arrayOfInputIDs => {
    for (let i = 0; i < arrayOfInputIDs.length; i++) {
        $(`#${arrayOfInputIDs[i]}`).prop('disabled', false).val('');
    }
}

// eslint-disable-next-line no-unused-vars
const fillDates = (week_id, arrayOfInputIDs, pageType) => {

    const year = week_id.substring(0, 4);
    const week = week_id.substring(4, 6);

    const getDatesArray = (year_, week_) => {

        // eslint-disable-next-line no-undef
        const sharedFridayFullDate = new Date(moment().year(year_).day("Friday").week(week_));
        const sharedFridayDateIndex = sharedFridayFullDate.getDate();

        const offsetArray = [-6,-5,-4,-3,-2,-1,0,1];
        const datesArray_ = [];

        // create an array of 8 dates, beginning and ending with Saturday, containing shared Friday
        for (let i = 0; i <= 7; i++) {
            const offset = offsetArray[i];
            const thisYear = sharedFridayFullDate.getFullYear();
            const thisMonth = sharedFridayFullDate.getMonth();
            const thisDay = sharedFridayDateIndex + offset;
            const thisDate = new Date(thisYear, thisMonth, thisDay);
            datesArray_.push(thisDate);
        }

        return datesArray_;
    }

    const datesArray = getDatesArray(year, week);

    if (pageType === 'sales') {
        // set the input fields to show correct dates (in correct format)
        // for the sales week, the 7 days correspond to the
        // indexes 1-7 in the datesArray, whereas for the
        // labor week, the 7 days correspond to the indexes 0-6,
        // with periodEndDate being index 6
        for (let i = 0; i < arrayOfInputIDs.length; i++) {
            // eslint-disable-next-line no-undef
            $(`#${arrayOfInputIDs[i]}`).val(moment(datesArray[i+1]).format('YYYYMMDD'));
        }
    } else if (pageType === 'labor') {
        // periodEndDate corresponds to datesArray[6] 
        // eslint-disable-next-line no-undef
        $(`#${arrayOfInputIDs[0]}`).val(moment(datesArray[6]).format('YYYYMMDD'));
    }
}

//  the following cookie functions are adapted from:
//  https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/

// eslint-disable-next-line no-unused-vars
const getCookie = name => {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

const setCookie = (name, value) => {
    var d = new Date;
    d.setTime(d.getTime() + 2*60*1000); // expires in 2 minutes (in milliseconds)
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

// eslint-disable-next-line no-unused-vars
const deleteCookie = name => { setCookie(name, '', -1); }


      