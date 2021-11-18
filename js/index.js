const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const search_result_space = document.getElementById("suggestions");

const body = document.getElementById("body");

const tringle_wrapper = document.getElementById("tringle_wrapper");

const searchWrapper = document.getElementById("search_wrapper");

// loader
const loader = document.querySelector(".loader");

searchInput.addEventListener("input", function () {
    if ((e.which == 13) | (searchInput.value == "")){
        return false;
      }

    if (searchInput.value !== "") {
    searchButton.addEventListener("click", searchCompanies);
    searchButton.classList.add("able");
    searchCompanies();
    tringle_wrapper.style.display = "block";
  } else {
    console.log("input is empty");
    search_result_space.style.display = "none";
    tringle_wrapper.style.display = "none";
    searchButton.removeEventListener("click");
    searchButton.classList.remove("able");
  }
});

// searching on enter
searchWrapper.addEventListener(
  "submit",
  function (e) {
    searchCompanies();
    e.preventDefault();
  },
  false
);

const searchCompanies = () => {
  searchButton.style.display = "none";
  loader.style.display = "block";
  search_result_space.style.display = "flex";
  const userInput = searchInput.value;

  const stocksUrl =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
    userInput +
    "&limit=10&exchange=NASDAQ";
  fetch(stocksUrl)
    .then((response) => response.json())
    .then((data) => {
      suggestions.innerHTML = "";

      for (let i = 0; i < data.length; i++) {
        const searchedCompany = document.createElement("a");

        searchedCompany.setAttribute("id", "suggestions_element");

        searchedCompany.href =
          "./html/company.html?symbol=" + data[i]["symbol"];

        const url =
          "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
          data[i]["symbol"];
        fetch(url)
          .then((response2) => response2.json())
          .then((data2) => {
            let percentages = data2.profile["changesPercentage"];

            if ((percentages === "(0%)") | (percentages === "0.0")) {
            } else {
              percentages = parseFloat(percentages).toFixed(2);
            }

            let stockPercentages = document.createElement("span");
            stockPercentages.setAttribute("id", "stockPercentages");
            stockPercentages.append(percentages);
            stockPercentages.setAttribute(
              "onerror",
              "this.style.display='none'"
            );

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

            let companyNameSearched = document.createElement("span");
            companyNameSearched.setAttribute("id", "companyName");
            companyNameSearched.innerHTML = data[i]["name"];

            let companySymbolSearched = document.createElement("span");
            companySymbolSearched.setAttribute("id", "companySymbol");
            companySymbolSearched.innerHTML = "  (" + data[i]["symbol"] + ")  ";

            if (userInput !== "") {
              let text = companyNameSearched.innerHTML;
              let re = new RegExp(userInput, "gi");
              let newText = text.replace(re, `<span id="mark">$&</span>`);
              companyNameSearched.innerHTML = newText;
            }

            if (userInput !== "") {
              let text = companySymbolSearched.innerHTML;
              let re = new RegExp(userInput, "gi");
              let newText = text.replace(re, `<span id="mark">$&</span>`);
              companySymbolSearched.innerHTML = newText;
            }

            searchedCompany.innerHTML =
              `<img id="imgId" onerror="this.src='https://i.ibb.co/TKpvydb/default.png'" src="${data2.profile["image"]}">` +
              companyNameSearched.innerHTML +
              companySymbolSearched.innerHTML +
              stockPercentages.innerHTML;

            suggestions.appendChild(searchedCompany);
          });
      }
      loader.style.display = "none";
      searchButton.style.display = "block";
    });
};

const urlMarquee =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list";

let symbolsArray = [];
let pricesArray = [];

fetch(urlMarquee)
  .then((response3) => response3.json())
  .then((data3) => {
    for (let i = 0; i < 1000; i++) {
      symbolsArray.push(data3[i]["symbol"]);
      pricesArray.push(data3[i]["price"]);

      const marqueeElement = document.createElement("span");

      marqueeElement.innerHTML =
        `<span><span id="marqueeCompanyName" class="marqueeElement first">` +
        data3[i]["symbol"] +
        `</span>` +
        `<span id="marqueeCompanyPrice" class="marqueeElement second" style="color: #33D759FF"> $` +
        data3[i]["price"] +
        `</span></span>`;

      marquee.appendChild(marqueeElement);
    }
  });
