'use strict';

const SALESWEEKS_URL = '/salesWeeks';
const LABORWEEKS_URL = '/laborWeeks';

const getDataFromAPIs = function(weekID) {

    return new Promise(function(resolve, reject) {

        const getSalesWeek = getDataFromSalesWeeksAPI(weekID);

        const getLaborWeek = getDataFromLaborWeeksAPI(weekID);

        const getSalesAndLaborWeeks = Promise.all([getSalesWeek, getLaborWeek]);

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
                const errorMessage = `Sales data for week ${weekID} not found.`;
                const $messageDiv = $('.js-message-sales');
                $messageDiv.removeClass('hidden');
                $messageDiv.append(`<p>${errorMessage}</p><button type="button">X</button>`);
                $messageDiv.css("background-color", "#ffcccc");
                $messageDiv.on("click", "button", () => {
                    $messageDiv.addClass('hidden');
                    //only clear input when both messages have been hidden
                    if ($('.js-message-labor').hasClass('hidden')) {
                        clearInput();
                    }
                });
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
                const errorMessage = `Labor data for week ${weekID} not found.`;
                const $messageDiv = $('.js-message-labor');
                $messageDiv.removeClass('hidden');
                $messageDiv.append(`<p>${errorMessage}</p><button type="button">X</button>`);
                $messageDiv.css("background-color", "#ffcccc");
                $messageDiv.on("click", "button", () => {
                    $messageDiv.addClass('hidden');
                    //only clear input when both messages have been hidden
                    if ($('.js-message-sales').hasClass('hidden')) {
                        clearInput();
                    }   
                });
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
    } else {
        const errorMessage = "salesWeek1.week_id does not match laborWeek1.week_id";
        const $messageDiv = $('.js-message');
        $messageDiv.removeClass('hidden');
        $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
        $messageDiv.css("background-color", "#ffcccc");
        $('button.remove').click( () => {
            $messageDiv.toggleClass('hidden');
        });
    }
}

function doSomeD3(data) {

    unhideResultsDiv();

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
    let svgWidth = 500;
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

function unhideResultsDiv() {
    $('.js-results').prop('hidden', false);
}

function clearMessage($aMessageDiv) {
    $aMessageDiv.html('');
    $aMessageDiv.addClass('hidden');
}

function clearInput() {
    $('.js-query').val("");
}

function watchSubmitSearch() {

    clearInput();

    $('.js-search-form').submit(event => {
      event.preventDefault();

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
        .catch(err => {
            const errorMessage = `Something went wrong. Error code ${err.code}`;
            const $messageDiv = $('.js-message');
            $messageDiv.removeClass('hidden');
            $messageDiv.html(`<p>${errorMessage}</p><button type="button" class="remove">X</button>`);
            $messageDiv.css("background-color", "#ffcccc");
            $('button.remove').click( () => {
                $messageDiv.toggleClass('hidden');
            });
        });
      
    });
}

$(watchSubmitSearch);


