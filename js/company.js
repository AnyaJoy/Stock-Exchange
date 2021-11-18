// loader
const loader = document.querySelector("#loading");

const pageWrapper = document.getElementById("pageWrapper");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 4000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

const tringle_wrapper = document.getElementById("tringle_wrapper");

function displayCompanyInfo() {
    tringle_wrapper.style.display = "block";
};


function displayPage() {
    pageWrapper.style.display = "block";
};

displayLoading();

const companySymbolExtracted = window.location.search.replace ("?symbol=", "");

const url = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" + companySymbolExtracted;

const companyWrapper = document.getElementById ("companyWrapper");

const img = document.getElementById ("img");

let stockPercentages = document.getElementById ("stockPercentages");

fetch (url)
.then ((response) => response.json())
.then((data) => {
    let percentages = data["profile"]["changesPercentage"];

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

function hidetheImg() {
    img.style.display = "none";
};

const urlChart = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/'+companySymbolExtracted+'?serietype=line';

let datesPrices = [];
let datesArray = [];
let priceArray = [];

fetch (urlChart)
.then ((response) => response.json())
.then((data) => {
    datesPrices = data.historical;
    for (let i = 0; i < datesPrices.length; i = i + 30) {
        datesArray.push(datesPrices[i]["date"]);
        priceArray.push(datesPrices[i]["close"])
    }
    console.log(datesArray)
    let datesArrayReversed = datesArray.reverse();
    let priceArrayReversed = priceArray.reverse();
    console.log(datesArrayReversed)

    hideLoading();
    displayPage();
    displayCompanyInfo();

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

