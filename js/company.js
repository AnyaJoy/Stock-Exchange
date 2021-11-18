// getting elements
const loader = document.querySelector("#loading");
const pageWrapper = document.getElementById("pageWrapper");
const tringleWrapper = document.getElementById("tringle_wrapper");
const companyWrapper = document.getElementById ("companyWrapper");
const img = document.getElementById ("img");
let stockPercentages = document.getElementById ("stockPercentages");

function displayLoading() {
    loader.classList.add("display");
    setTimeout(() => {
        loader.classList.remove("display");
    }, 4000);
}

// loader on page load
displayLoading();

//getting the company's symbol from url
const companySymbolExtracted = window.location.search.replace ("?symbol=", "");

//fetching the company's data using the symbol
const url = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" + companySymbolExtracted;

fetch (url)
.then ((response) => response.json())
.then((data) => {

    //change in stock price
    let percentages = data["profile"]["changesPercentage"];

    //styling the change in stock price depemding on how it has changed
    if (percentages === "(0%)" | percentages === "0.0") {} else {percentages = parseFloat(percentages).toFixed(2)};

    if (percentages < 0) {
        stockPercentages.classList.add("negative");
    } else {
        stockPercentages.classList.remove("negative");
        stockPercentages.classList.add("positive");
    };
    if (percentages === "(0%)") {
        stockPercentages.classList.remove("negative");
        stockPercentages.classList.remove("positive");
        stockPercentages.classList.add("neutral");
    };
    if (percentages === "0.0") {
        stockPercentages.classList.remove("negative");
        stockPercentages.classList.remove("positive");
        stockPercentages.classList.remove("neutral");
        stockPercentages.classList.add("neutral2");
    };  

    //putting the company's logo, symbol, name, stock price, price change, description and website link on the DOM
    img.src = data["profile"]["image"];
    companySymbol.append(companySymbolExtracted);
    companyName.append(`(${data["profile"]["companyName"]})`);
    stockPrice.append("$"+ data["profile"]["price"]);
    stockPercentages.append(percentages);
    aboutCompany.append(data["profile"]["description"]);

    const website = document.createElement("a");
    website.href = data["profile"]["website"];
    website.target="_blank";
    website.innerHTML = "Visit the Company's Website";
    companyWebsite.append(website);
});

//creating a chart with stock price history
const urlChart = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/'+companySymbolExtracted+'?serietype=line';

//creating arrays for th whole data and dates and prices separately
let datesPrices = [];
let datesArray = [];
let priceArray = [];

//fetching the stock history
fetch (urlChart)
.then ((response) => response.json())
.then((data) => {

    //pushing dates and prices to arrays
    datesPrices = data.historical;
    for (let i = 0; i < datesPrices.length; i = i + 30) {
        datesArray.push(datesPrices[i]["date"]);
        priceArray.push(datesPrices[i]["close"])
    }

    //reversing the arrays for correct displaying
    let datesArrayReversed = datesArray.reverse();
    let priceArrayReversed = priceArray.reverse();
    console.log(datesArrayReversed)

    loader.classList.remove("display");;
    pageWrapper.style.display = "block";;
    tringleWrapper.style.display = "block";

    //creating the chart
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: datesArrayReversed,
        datasets: [{
            label: 'Stock Price History',
            data: priceArrayReversed,
            backgroundColor:'rgb(153,142,215)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            tension: 0.5,
            fill: 'origin',
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})
});

