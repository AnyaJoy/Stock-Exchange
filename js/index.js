// getting elements
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResultSpace = document.getElementById("suggestions");
const tringle = document.getElementById("triangleUp");
const siteDescription = document.getElementById("site-description");
const form = document.getElementById("search_wrapper");
const loader = document.querySelector(".loader");

//creating the marquee at the top
const urlMarquee =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list";

let symbolsArray = [];
let pricesArray = [];

//fetching the stocks data
fetch(urlMarquee)
  .then((response3) => response3.json())
  .then((data3) => {
    //looping through the data, pushing companies' symbols and prices into arrays
    for (let i = 0; i < 1000; i++) {
      symbolsArray.push(data3[i]["symbol"]);
      pricesArray.push(data3[i]["price"]);

      //creating the marquee element
      const marqueeElement = document.createElement("span");

      marqueeElement.innerHTML =
        `<span><span id="marqueeCompanyName" class="marqueeElement first">` +
        data3[i]["symbol"] +
        `</span>` +
        `<span id="marqueeCompanyPrice" class="marqueeElement second" style="color: #33D759FF"> $` +
        data3[i]["price"] +
        `</span></span>`;

      //putting the marquee on the DOM
      marquee.appendChild(marqueeElement);
    }
  });

// searching companies on input
searchInput.addEventListener("input", function () {
  if (searchInput.value !== "") {
    searchButton.classList.add("able");
    siteDescription.style.display = "none";
    tringle.style.display = "none";
    searchCompanies();
  } else {
    console.log(searchInput.value);
    siteDescription.style.display = "block";
    searchResultSpace.style.display = "none";
    searchButton.classList.remove("able");
  }
});

// searching companies on enter
form.addEventListener(
  "submit",
  function (e) {
    searchCompanies();
    e.preventDefault();
  },
  false
);

// the searching fucntion
const searchCompanies = () => {
  searchButton.style.display = "none";
  loader.style.display = "block";
  searchResultSpace.style.display = "flex";
  const userInput = searchInput.value;

  //fethching 10 companies' data
  const stocksUrl =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
    userInput +
    "&limit=10&exchange=NASDAQ";

  fetch(stocksUrl)
    .then((response) => response.json())
    .then((data) => {

      // checking if data exists
      if (data.length == 0) {
        suggestions.innerHTML = `<div style="margin: 15px">No companies found :(</div>`
      } else {

        //clearing the search space
        suggestions.innerHTML = "";

        // looping through each company
        for (let i = 0; i < data.length; i++) {

          //creating a search element with link to the company's profile
          const searchedCompany = document.createElement("a");
          searchedCompany.setAttribute("id", "suggestions_element");
          searchedCompany.href =
            "./html/company.html?symbol=" + data[i]["symbol"];

          // fethcing the company's data
          const url =
            "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
            data[i]["symbol"];

          fetch(url)
            .then((response2) => response2.json())
            .then((data2) => {

              // change in stock price in percents
              let percentages = data2.profile["changesPercentage"];

              // leaving 2 digits after a dot in stock price change
              if ((percentages === "(0%)") | (percentages === "0.0")) {
              } else {
                percentages = parseFloat(percentages).toFixed(2);
              }

              //creating an element for the company's stock price change
              let stockPercentages = document.createElement("span");
              stockPercentages.setAttribute("id", "stockPercentages");
              stockPercentages.setAttribute(
                "onerror",
                "this.style.display='none'"
              );

              // styling the change in stock price depending on how it has changed
              if (percentages < 0) {
                stockPercentages.innerHTML =
                  `<span style="color: red" >(` + percentages + `%)</span>`;
              } else {
                stockPercentages.innerHTML =
                  `<span style="color: #33D759FF" >(+` +
                  percentages +
                  `%)</span>`;
              }
              if (percentages === "0.0") {
                stockPercentages.innerHTML =
                  `<span style="color: black" >(` + percentages + `%)</span>`;
              }
              if (percentages === "(0%)") {
                stockPercentages.innerHTML =
                  `<span style="color: black" >` + percentages + `</span>`;
              }

              // creating an element for the company's name
              let companyNameSearched = document.createElement("span");
              companyNameSearched.setAttribute("id", "companyName");
              companyNameSearched.innerHTML = data[i]["name"];

              // creating an element for the company's symbol
              let companySymbolSearched = document.createElement("span");
              companySymbolSearched.setAttribute("id", "companySymbol");
              companySymbolSearched.innerHTML =
                "  (" + data[i]["symbol"] + ")  ";

              // highlighting the matched symbols from search in company's name
              if (userInput !== "") {
                let text = companyNameSearched.innerHTML;
                let re = new RegExp(userInput, "gi");
                let newText = text.replace(re, `<span id="mark">$&</span>`);
                companyNameSearched.innerHTML = newText;
              }

              // highlighting the matched symbols from search in company's symbol
              if (userInput !== "") {
                let text = companySymbolSearched.innerHTML;
                let re = new RegExp(userInput, "gi");
                let newText = text.replace(re, `<span id="mark">$&</span>`);
                companySymbolSearched.innerHTML = newText;
              }

              // adding the name, symbol, stock price and logo to the company's search element
              searchedCompany.innerHTML =
                `<img id="imgId" onerror="this.src='https://i.ibb.co/TKpvydb/default.png'" src="${data2.profile["image"]}">` +
                companyNameSearched.innerHTML +
                companySymbolSearched.innerHTML +
                stockPercentages.innerHTML;

              //putting the company's search element on the DOM
              suggestions.appendChild(searchedCompany);
            });
        }
      }
      setTimeout(() => {
        tringle.style.display = "block";
        loader.style.display = "none";
        searchButton.style.display = "block";
      }, [300]);
    });
};

//searching companies on the button click
searchButton.addEventListener("click", searchCompanies);
