'use strict'

const SALESWEEKS_URL = '/salesWeeks';
const LABORWEEKS_URL = '/laborWeeks';

const getDataFromAPIs = function(weekID) {

    /*
    return new Promise(function(resolve, reject) {
    */

        const getSalesWeek = getDataFromSalesWeeksAPI(weekID);

        const getLaborWeek = getDataFromLaborWeeksAPI(weekID);

        // returns responses (an array)
        return Promise.all([getSalesWeek, getLaborWeek]);

        /*
        let grossPayByDept;

        getSalesAndLaborWeeks
            .then(function(responses) {
                let salesWeek = responses[0];
                let laborWeek = responses[1];
                
                grossPayByDept = createGrossPayByDeptObj(salesWeek, laborWeek);
                if (grossPayByDept != undefined) {
                    resolve (grossPayByDept);
                } else {
                    reject(Error("There has been an error in getDataFromAPIs"));
                }
                
            });
            
    });
    */
}

const getDataFromSalesWeeksAPI = function(weekID) {

    return new Promise(function(resolve) {

        const settings = {
            url: `${SALESWEEKS_URL}/${weekID}`,
            dataType: 'json'
        };

        $.get(settings, function(data) {
            resolve(data);
        })
            .fail(function() {
                resolve(null);
            });
    });
}

const getDataFromLaborWeeksAPI = function(weekID) {

    return new Promise(function(resolve) {

        const settings = {
            url: `${LABORWEEKS_URL}/${weekID}`,
            dataType: 'json'
        };

        $.get(settings, function(data) {
            resolve(data);
        })
            .fail(function() {
                resolve(null);
            });
    });
}

// create a data object for D3 containing only the gross pay totals for each dept
function createGrossPayByDeptObj(salesWeek_, laborWeek_) {

    let salesWeek1 = salesWeek_;
    let laborWeek1 = laborWeek_;

    let grossPayByDeptData = {};

    if (salesWeek1.week_id === laborWeek1.week_id) { // only merge if both weeks are the same
        grossPayByDeptData.bakrsTotalGrossPay = laborWeek1.bakrsTotalGrossPay;
        grossPayByDeptData.csrvcTotalGrossPay = laborWeek1.csrvcTotalGrossPay;
        grossPayByDeptData.drvrsTotalGrossPay = laborWeek1.drvrsTotalGrossPay;
        grossPayByDeptData.jntrsTotalGrossPay = laborWeek1.jntrsTotalGrossPay;
        grossPayByDeptData.pckrsTotalGrossPay = laborWeek1.pckrsTotalGrossPay;
        grossPayByDeptData.totalSales = salesWeek1.totalSales;
        return grossPayByDeptData;
    }

    throw new Error('Error in createGrossPayByDeptObj: Week IDs do not match');
    
}

function doSomeD3(data) {

    $('.js-results').prop('hidden', false);

    // extract labor data into its own object, put sales data in a separate variable
    const totalGrossPayByDept = [];

    // typically this order will reflect greatest to least, i.e. bakers > packers > drivers, etc
    totalGrossPayByDept[0] = data.bakrsTotalGrossPay; // totalGrossPayByDept[0] = bakers
    totalGrossPayByDept[1] = data.pckrsTotalGrossPay; // totalGrossPayByDept[1] = packers
    totalGrossPayByDept[2] = data.drvrsTotalGrossPay; // totalGrossPayByDept[2] = drivers
    totalGrossPayByDept[3] = data.jntrsTotalGrossPay; // totalGrossPayByDept[3] = janitors
    totalGrossPayByDept[4] = data.csrvcTotalGrossPay; // totalGrossPayByDept[4] = customer service
    
    const totalSales = data.totalSales;

    //Width and height
    let svgWidth = 320;
    let svgHeight = 600;
    let barWidth = 300;
    let centeredX = svgWidth/2-barWidth/2;
    

    //Create scale functions
    let yScale = d3.scaleLinear() 
                    .domain([0, totalSales])
                    .rangeRound([0, svgHeight]);

    const arrayOfGoalPercents = [ 14, 7, 7, 3, 2 ];
    const arrayOfDeptNames = [ "Bakers", "Packers", "Drivers", "Janitors", "Office" ];
    let arrayOfActualPercents = [];
    let arrayOfFillColors = [];
    let arrayOfYs = [];
    let totalY = 0;
    const passingFillColor = "palegreen";
    const failingFillColor = "salmon";
    let passingIcon = "✅";
    let failingIcon = "❌";
    let totalLabor = 0;
    let totalGoalPercent = 0;

    for (let i = 0; i < totalGrossPayByDept.length; i++) {
        totalY += yScale(totalGrossPayByDept[i]);
        arrayOfYs.push(totalY);
    } 

    for (let i = 0; i < totalGrossPayByDept.length; i++) {
        arrayOfActualPercents.push(totalGrossPayByDept[i]/totalSales*100);
    }

    for (let i = 0; i < totalGrossPayByDept.length; i++) {
        if (arrayOfActualPercents[i] <= arrayOfGoalPercents[i]) {
            arrayOfFillColors.push(passingFillColor);
        } else {
            arrayOfFillColors.push(failingFillColor);
        }
    }

    for (let i = 0; i < totalGrossPayByDept.length; i++) {
        totalLabor += totalGrossPayByDept[i];
    }

    for (let i = 0; i < arrayOfGoalPercents.length; i++) {
        totalGoalPercent += arrayOfGoalPercents[i];
    }

    const totalPercent = totalLabor/totalSales*100;

    //Create SVG element
    let svg = d3.select(".js-results") 
                .append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

    // background rectangle represents totalSales
    svg.append("rect")
        .classed("sales", true) // add sales class to the sales rectangle
        .attr("x", centeredX)
        .attr("y", 0)
        .attr("width", barWidth)
        .attr("height", yScale(totalSales))
        .attr("fill", "papayaWhip")
        .attr("stroke", "black");
        
    // add label for sales figure
    svg.append("text")
        .classed("sales", true)
        .text("Total Sales - $" + totalSales.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'))
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("x", centeredX + barWidth/2)
        .attr("y", 50);

    svg.append("text")
        .classed("sales", true)
        .text(function() {
            const laborPercentAndLabel = "Total Labor - " + totalPercent.toFixed(2) + "%";
            if (totalPercent <= totalGoalPercent) {
                return laborPercentAndLabel + " " + passingIcon;
            } else {
                return laborPercentAndLabel + " " + failingIcon;
            }   
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("x", centeredX + barWidth/2)
        .attr("y", svgHeight - arrayOfYs[4] - 25);

    //Create bars representing each department's labor
    svg.selectAll("rect:not(.sales)") // select all rectangles except those with sales class
       .data(totalGrossPayByDept)
       .enter()
       .append("rect")
       .attr("x", centeredX) // center the bar inside the svg space
       .attr("y", function(d, i) {
            return svgHeight - arrayOfYs[i];
       })
       .attr("width", barWidth)
       .attr("height", function(d) {
            return yScale(d);
        })
       .attr("fill", function(d, i) {
            return arrayOfFillColors[i];
       })
       .attr("stroke", "black");

    // add labels for labor percents
    svg.selectAll("text:not(.sales)")
       .data(totalGrossPayByDept)
       .enter()
       .append("text")
       .text(function(d, i) {
            return arrayOfDeptNames[i] + " - " + arrayOfActualPercents[i].toFixed(2) + "%";
       })
       .attr("dominant-baseline", "middle")
       .attr("text-anchor", "middle")
       .attr("x", centeredX + barWidth/2)
       .attr("y", function(d, i) {
            return svgHeight - arrayOfYs[i] + yScale(d)/2;
       })
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "black");
}

function showButtonsAndMessages(responses) {
    const salesWeek = responses[0];
    const laborWeek = responses[1];
    const successDiv = '.js-message';
    const laborDiv = '.js-message-labor';
    const salesDiv = '.js-message-sales';
    const addLaborMessage = 'No labor data found, click below to add';
    const addSalesMessage = 'No sales data found, click below to add';
    const updateLaborMessage = 'Existing labor data found, click below to update';
    const updateSalesMessage = 'Existing sales data found, click below to update';

    console.log(salesWeek);
    console.log(laborWeek);

    const successMessage = getCookie("success-message");

    if (successMessage) {
        createMessage(successMessage, successDiv);
        deleteCookie("success-message");
    }

    // salesWeek is found but laborWeek is not found
    if (salesWeek && !laborWeek) {
        createMessage(updateSalesMessage, salesDiv);
        createMessage(addLaborMessage, laborDiv);
        createButton('update', 'sales');
        createButton('add', 'labor');
    }

    // salesWeek is not found but laborWeek is found
    if (!salesWeek && laborWeek) {
        createMessage(addSalesMessage, salesDiv);
        createMessage(updateLaborMessage, laborDiv);
        createButton('add', 'sales');
        createButton('update', 'labor');  
    }

    // neither salesWeek nor laborWeek are found
    if (!salesWeek && !laborWeek) {
        createMessage(addSalesMessage, salesDiv);
        createMessage(addLaborMessage, laborDiv);
        createButton('add', 'sales');
        createButton('add', 'labor');
    }

    // if both salesWeek and laborWeek are found
    if (salesWeek && laborWeek) {
        createMessage(updateSalesMessage, salesDiv);
        createMessage(updateLaborMessage, laborDiv);
        createButton('update', 'sales');
        createButton('update', 'labor');
    }

    // passing the original data from API call to showReport function
    // why does this not belong in the if statement above? because promise will error??
    return responses;
}

function createMessage(message, whichDiv) {
    const $messageDiv = $(whichDiv);
    // trim the leading period off the div's class name
    const whichDivTrimmedString = whichDiv.substring(1, whichDiv.length);
    $messageDiv.removeClass('hidden');
    $messageDiv.html(`<p>${message}</p><button type="button" class="remove remove-${whichDivTrimmedString}">x</button>`);
    // message styling adapted from https://getbootstrap.com/docs/4.0/components/alerts/
    if (whichDiv === '.js-message') { // success styling
        $messageDiv.css("background-color", "#d4edda");
        $messageDiv.css("border-color", "#c3e6cb");
        $messageDiv.css("color", "#155724");
    } else { // info styling
        $messageDiv.css("background-color", "#e2e3e5");
        $messageDiv.css("border-color", "#d6d8db");
        $messageDiv.css("color", "#383d41");
    }
    
    $(`button.remove-${whichDivTrimmedString}`).click( () => {
        $messageDiv.addClass('hidden');
    });
}

function createButton(action, page) {
    const pageTitleCase = page.charAt(0).toUpperCase() + page.slice(1);
    const actionTitleCase = action.charAt(0).toUpperCase() + action.slice(1);
    
    console.log(pageTitleCase);
    console.log(actionTitleCase);

    $('.js-buttons').append(`
        <a class="button" href="/add${pageTitleCase}?week_id=${weekID}">${actionTitleCase} ${pageTitleCase} Data</a>
    `);
}

function showReport(responses) {
    const salesWeek = responses[0];
    const laborWeek = responses[1];

    // if either sales or labor data are missing, return and don't show report
    if (!salesWeek || !laborWeek) {
        // give up
        return
    }

    

    
    
    // create gross pay object (takes salesWeek and laborWeek)
    const data = createGrossPayByDeptObj(salesWeek, laborWeek);
    // do we still need the error messages in createGrossPayByDeptObj?

    doSomeD3(data);
    //do some D3 (takes data object created by create gross pay)

    
}

function handleErrors() {

}

function loadSearchResults() {
    console.log('loadSearchResults ran');
    console.log(weekID);

    const year = weekID.substring(0, 4);
    let week;
    // if the week number has a leading zero, remove it
    if (weekID.substring(4, 5) === '0') {
        week = weekID.substring(5, 6);
    } else {
        week = weekID.substring(4, 6);
    }
    const salesStartDate = new Date(moment().year(year).day("Sunday").week(week));
    const salesEndDate = new Date(moment().year(year).day("Saturday").week(week));
    const salesStartDateString = moment(salesStartDate).format('ddd D MMM YYYY');
    const salesEndDateString = moment(salesEndDate).format('ddd D MMM YYYY');
    const laborStartDateString = moment(salesStartDate).subtract(1,'day').format('ddd D MMM YYYY');
    const laborEndDateString = moment(salesEndDate).subtract(1,'day').format('ddd D MMM YYYY');

    

    $('h2').text(`Week ${week} of ${year}`);
    $('h2').after(`<p>Sales: ${salesStartDateString} &ndash; ${salesEndDateString}</p><p>Labor: ${laborStartDateString} &ndash; ${laborEndDateString}</p><br>`)

    // get sales+labor from db
    // (could be existing data or null data for either, OR an error)
    getDataFromAPIs(weekID)
        .then(showButtonsAndMessages) // receives "responses" as data, then shows buttons depending on data status
        .then(showReport) // if all data exists
        .catch(handleErrors);
}

$(loadSearchResults);







/* some code brought over from index.js - might use later

      //grab input, save input, then clear input
      const queryTarget = $(event.currentTarget).find('.js-query');
      const query = queryTarget.val();
      

      //clear results div in case of previous results displayed
      $('.js-results').html('');

      //clear all messages in case of previous message 
      clearMessage($('.js-message'));
      clearMessage($('.js-message-labor'));
      clearMessage($('.js-message-sales'));

      getDataFromAPIs(query)
        .then(doSomeD3)
        .catch( () => {
            const errorMessage = 'Cannot search without a week number.';
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
        });
*/
