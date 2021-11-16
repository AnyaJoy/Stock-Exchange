const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const search_result_space = document.getElementsByClassName("search_result_space");

const body = document.getElementById("body");

const tringle_wrapper = document.getElementById("tringle_wrapper")





// loader
const loader = document.querySelector("#loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    // setTimeout(() => {
    //     loader.classList.remove("display");
    // }, 4000);
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}

searchInput.addEventListener("input", displayLoading);
searchInput.addEventListener("input", displaySearchResultSpace);


// нажатие кнопки на enter!!!
document.getElementById('search_wrapper').addEventListener('submit', function(e) {
    searchCompanies();
    e.preventDefault();
}, false);

const debounce = (func, delay) => {
    let debounceTimer
    return function() {
        const context = this
        const args = arguments
            clearTimeout(debounceTimer)
                debounceTimer
            = setTimeout(() => func.apply(context, args), delay)
    }
} 

searchInput.addEventListener("keyup", debounce(function() {
    searchCompanies()
        }, 2000));

function displaySearchResultSpace() {
    tringle_wrapper.style.display = "block";
};

const searchCompanies = () => {
    displayLoading();
    const userInput = searchInput.value;
    const stocksUrl = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query="+userInput+"&limit=10&exchange=NASDAQ";
    fetch(stocksUrl)
      .then((response) => response.json())
      .then((data) => {
            suggestions.innerHTML = ''; 
        
            for (let i = 0; i < data.length; i++) {
                        
            const searchedCompany = document.createElement("a");

            searchedCompany.setAttribute("id","suggestions_element");

            searchedCompany.href = './html/company.html?symbol=' + data[i]["symbol"];

            const url = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" + data[i]["symbol"];
                fetch (url)
                .then ((response2) => response2.json())
                .then((data2) => {
                    let percentages = data2.profile["changesPercentage"];
                    
                    if (percentages === "(0%)" | percentages === "0.0") {} else
                    {percentages = parseFloat(percentages).toFixed(2)};

                    let stockPercentages = document.createElement("span");
                    stockPercentages.setAttribute("id","stockPercentages");
                    stockPercentages.append(percentages);
                    stockPercentages.setAttribute("onerror","this.style.display='none'");

                    if (percentages < 0) {
                        stockPercentages.innerHTML = `<span style="color: red" >(` + percentages + `%)</span>`;  
                    } else {
                        stockPercentages.innerHTML = `<span style="color: #33D759FF" >(+` + percentages + `%)</span>`; 
                    };

                    if (percentages === "0.0") {
                        stockPercentages.innerHTML = `<span style="color: black" >(` + percentages + `%)</span>`;  
                    };  

                    if (percentages === "(0%)") {
                        stockPercentages.innerHTML = `<span style="color: black" >` + percentages + `</span>`; 
                    };

                    let companyNameSearched = document.createElement("span");
                    companyNameSearched.setAttribute("id","companyName");
                    companyNameSearched.innerHTML = data[i]["name"];

                    let companySymbolSearched = document.createElement("span");
                    companySymbolSearched.setAttribute("id","companySymbol");
                    companySymbolSearched.innerHTML = "  (" + data[i]["symbol"] + ")  ";

                    if (userInput !== "") {
                        let text =  companyNameSearched.innerHTML;
                        let re = new RegExp(userInput,"gi");
                        let newText = text.replace(re, `<span id="mark">$&</span>`);
                        companyNameSearched.innerHTML = newText;
                    }

                    if (userInput !== "") {
                        let text =  companySymbolSearched.innerHTML;
                        let re = new RegExp(userInput,"gi");
                        let newText = text.replace(re, `<span id="mark">$&</span>`);
                        companySymbolSearched.innerHTML = newText;
                    }

                    searchedCompany.innerHTML = `<img id="imgId" onerror="this.src='https://i.ibb.co/TKpvydb/default.png'" src="${data2.profile["image"]}">` + companyNameSearched.innerHTML + companySymbolSearched.innerHTML + stockPercentages.innerHTML;

                    suggestions.appendChild(searchedCompany); 
                });
          }
          hideLoading();
    });
    };

    searchButton.addEventListener("click", searchCompanies);
    

    const urlMarquee = "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list";

    let symbolsArray = [];
    let pricesArray = [];

    fetch(urlMarquee)
    .then ((response3) => response3.json())
    .then ((data3) => {

        for (let i = 0; i < 1000; i++) {
            symbolsArray.push(data3[i]["symbol"]);
            pricesArray.push(data3[i]["price"]);

            const marqueeElement = document.createElement("span");

            marqueeElement.innerHTML = `<span><span id="marqueeCompanyName" class="marqueeElement first">` + data3[i]["symbol"] + `</span>` + `<span id="marqueeCompanyPrice" class="marqueeElement second" style="color: #33D759FF"> $` + data3[i]["price"] + `</span></span>`;

            marquee.appendChild(marqueeElement);
        }
    });


    

    