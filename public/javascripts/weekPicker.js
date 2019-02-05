// adapted from https://github.com/dnviti/jQueryWeekPicker
// with edits and modifications of my own

'use strict';

// for eslint
/* global moment
*/

const setWeekCalendar = settingElement => {
    
    let startDate;
    let endDate;
    let selectedDate; // the solution to all of our problems
    
    const highlightSelectedWeek = () => {
        window.setTimeout(function() {

            // only the selected day is active so far
            const activeElement = $("#ui-datepicker-div .ui-state-active");

            // select the table cell of the selected day
            const tdElement = activeElement.parent();

            // select the entire row pertaining to the selected day
            const trElement = tdElement.parent();

            // make the entire row highlighted as active
            trElement.find("a").addClass("ui-state-active")

        }, 1);
    };

    const generateYearWeekString = date => {
        const thisDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        let weekNum = moment(date).week().toString();

        // if week number is less than 10, add a leading zero
        if (weekNum < 10) { // this comparison works even though weekNum is a string
            weekNum = "0" + weekNum;
        }
        let weekYear = thisDate.getFullYear(); // number

        // if it's december and week 1 is selected then add 1 to the year
        if (thisDate.getMonth() == 11 && weekNum === '01') {
            weekYear += 1;
        }

        let yearWeekStringYYYYWW = weekYear.toString() + weekNum;
        return yearWeekStringYYYYWW;
    }

    $(settingElement).datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        showWeek: true,
        firstDay: 0,
        changeMonth: true,
        changeYear: true,
        yearRange: '2013:2023',
        calculateWeek: function(date) {
            return moment(date).week();
        },
        onSelect: function() {
            let datepickerValue = $(this).datepicker('getDate');
            selectedDate = new Date(datepickerValue.getFullYear(), datepickerValue.getMonth(), datepickerValue.getDate());
            let ywString = generateYearWeekString(selectedDate);
            $(this).val(ywString);
            // why oh why do we need start and end date? they're used in beforeShowDate, but why?
            startDate = new Date(datepickerValue.getFullYear(), datepickerValue.getMonth(), datepickerValue.getDate() - datepickerValue.getDay());
            endDate = new Date(datepickerValue.getFullYear(), datepickerValue.getMonth(), datepickerValue.getDate() - datepickerValue.getDay() + 6);
            highlightSelectedWeek();
            $(this).data('datepicker').inline = true;
        },
        onClose: function() {
            $(this).data('datepicker').inline = false;
        },
        beforeShow: function() {
            if (selectedDate) {
                $(this).datepicker('setDate', selectedDate);
                let ywString = generateYearWeekString(selectedDate);
                $(this).val(ywString);
                highlightSelectedWeek();
                let optionsObject = {
                    defaultDate: selectedDate
                }
                return optionsObject;
            }           
        },
        beforeShowDay: function(datepickerValue) {
            // what the heck does this do?
            let cssClass = '';
            if (datepickerValue >= startDate && datepickerValue <= endDate)
                cssClass = 'ui-datepicker-current-day';
            return [true, cssClass];
        },
        onChangeMonthYear: function() {
            highlightSelectedWeek();
        }
    }).datepicker('widget').addClass('ui-weekpicker');

    $('body').on('mousemove', '.ui-weekpicker .ui-datepicker-calendar tr', function() { $(this).find('td a').addClass('ui-state-hover'); });
    $('body').on('mouseleave', '.ui-weekpicker .ui-datepicker-calendar tr', function() { $(this).find('td a').removeClass('ui-state-hover'); });

    //let priorWeekID;
    //let userWeekID;

    $(settingElement).on('change', function() {
        
        // get user-inputted week_id from input field (user typed it in and didn't use weekpicker)
        let userWeekID = $(this).val();
        
        // need to validate input is in YYYYWW format before using it
        if (/^20[1-9][0-9][0-5][0-9]/.test(userWeekID)) {
            const year = userWeekID.substring(0, 4);
            const week = userWeekID.substring(4, 6);
            selectedDate = new Date(moment().year(year).day("Friday").week(week));
        }
    })
};

// eslint-disable-next-line no-unused-vars
const convertToWeekPicker = targetElement => {
    // should these be triple === signs?
    if (targetElement.prop("tagName") == "INPUT" && (targetElement.attr("type") == "text" || targetElement.attr("type") == "hidden")) {
        setWeekCalendar(targetElement);
    } else {
        targetElement.replaceWith("<span>ERROR: please control js console</span>");
        // eslint-disable-next-line no-console
        console.error("convertToWeekPicker() - ERROR: The target element is not compatible with this conversion, try to use an <input type=\"text\" /> or an <input type=\"hidden\" />");
    }
};
