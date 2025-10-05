const themeBtn = document.getElementById("theme-btn");
const darkIcon = document.querySelector("#dark-icon");
const lightIcon = document.querySelector("#light-icon");
const darkSpan = document.querySelector("#dark-span");
const lightSpan = document.querySelector("#light-span");

const controlsSection = document.querySelector('.controls-section');
const searchInput = document.getElementById('search-input');

const filterByRegionBtn = document.getElementById("filter-btn");
const regionsWrapper = document.querySelector('.regions-wrapper');
const regionBtn = document.querySelector('.regions-wrapper button');

const cardsWrapper = document.querySelector('.cards-wrapper');

const scrollBackUp = document.querySelector('.scroll-back-up');

const details = document.querySelector('.details');
const backBtn = document.getElementById('back-btn');
const detailsWrapper = document.querySelector('.details-wrapper');


let saveScrollLevel = 0;
let countries = [];

async function fetchCountries() {
  try {
    console.time("fetchCountries");
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,capital,population");

    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.statusText);
    }

    const data = await response.json();
    console.timeEnd("fetchCountries");
    return data;

  } catch (error) {
    console.error(error.message);
    console.timeEnd("fetchCountries");
    const localResponse = await fetch("./assets/countries.json");
    const localData = await localResponse.json();
    return localData;
  }
};

function generateCards(countries) {

  let cardsHTML = countries.map(country => {

    return `<article class="card" aria-label="${country.name.common}">
              <button type="button" class="card-button" data-country="${(country.name.common).split(" ").join("-")}">
                  <img src="${country.flags.png}" view-transition-name="${(country.name.common).split(" ").join("-")}" alt="Flag of ${country.name.common}">
                <div class="info">
                  <h3>${country.name.common}</h3>
                  <p><span class="stat">Population:</span> ${country.population.toLocaleString()}</p>
                  <p><span class="stat">Region:</span> ${country.region}</p>
                  <p><span class="stat">Capital:</span> ${country.name.common === "Palestine" ? "Jerusalem" : country.capital}</p>
                </div>
            </button>
          </article>`
  }).join("");
  cardsWrapper.innerHTML = cardsHTML;

}

// fetch country details by name
async function fetchCountryDetails(country) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=name,cca3,subregion,tld,currencies,languages,borders`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const countryDetails = await response.json();
    return countryDetails;

  } catch (error) {
    console.error(error.message);
    const localResponse = await fetch("./assets/countries.json");
    const localData = await localResponse.json();
    const specificCountry = localData.filter(c => c.name.common === country);
    return specificCountry;
  }
}

// show country details by name
async function fetchShowDetails(countryExtraDetails, selectedCountry) {
  let countryDetails = await fetchCountryDetails(selectedCountry);
  countryExtraDetails = await countryDetails.filter(country => country.name.common === selectedCountry);
  // console.log(countryExtraDetails)

  const filteredCountryArr = countries.filter(country => country.name.common === selectedCountry);

  const currencies = () => {
    if ((Object.keys(countryExtraDetails[0].currencies)).length > 1) {
      return `${Object.values(countryExtraDetails[0].currencies)[0]?.name} (${Object.values(countryExtraDetails[0].currencies)[0]?.symbol}), 
          ${Object.values(countryExtraDetails[0].currencies)[1]?.name} (${Object.values(countryExtraDetails[0].currencies)[1]?.symbol})`

    } else {
      return `${Object.values(countryExtraDetails[0].currencies)[0]?.name} (${Object.values(countryExtraDetails[0].currencies)[0]?.symbol})`
    }
  }
  countryDetailsGenerator(filteredCountryArr, countryExtraDetails, currencies);

}

// fetch country details by iso code
async function fetchCountryDetailsIsoCode(selectedCountryIsoCode) {

  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${encodeURIComponent(selectedCountryIsoCode)}?fields=name,cca3,subregion,tld,currencies,languages,borders`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const countryDetails = await response.json();
    // console.log(countryDetails)
    return countryDetails;

  } catch (error) {
    console.error(error.message);
    const localResponse = await fetch("./assets/countries.json");
    const localData = await localResponse.json();
    const specificCountry = localData.find(c => c.cca3 === selectedCountryIsoCode);
    return specificCountry;
  }
}

// show country details by iso code
async function fetchShowDetailsIsoCode(countryExtraDetails, selectedCountryIsoCode) {
  let countryDetails = await fetchCountryDetailsIsoCode(selectedCountryIsoCode);
  countryExtraDetails = countryDetails;

  const filteredCountryArr = countries.filter(country => country.cca3 === selectedCountryIsoCode);

  const currencies = () => {
    if ((Object.keys(countryExtraDetails.currencies)).length > 1) {
      return `${Object.values(countryExtraDetails.currencies)[0].name} (${Object.values(countryExtraDetails.currencies)[0].symbol}), 
          ${Object.values(countryExtraDetails.currencies)[1].name} (${Object.values(countryExtraDetails.currencies)[1].symbol})`

    } else {
      return `${Object.values(countryExtraDetails.currencies)[0].name} (${Object.values(countryExtraDetails.currencies)[0].symbol})`
    }
  }
  countryDetailsGeneratorIsoCode(filteredCountryArr, countryExtraDetails, currencies);

}


// details generator from name
function countryDetailsGenerator(filteredCountryArr, countryExtraDetails, currencies) {
  detailsWrapper.innerHTML =
    `<img src="${filteredCountryArr[0].flags.svg}" view-transition-name="${(filteredCountryArr[0].name.common).split(" ").join("-")}" alt="Flag of ${filteredCountryArr[0].name.common}">
    <div class="end-col">
      <div class="info">
        <h2>${filteredCountryArr[0].name.common}</h2>
        <p><span class="stat">Native Name:</span> ${(Object.values(filteredCountryArr[0].name.nativeName)[0]?.common) ?? filteredCountryArr[0].name.common}</p>
        <p><span class="stat">Population:</span> ${filteredCountryArr[0].population.toLocaleString()}</p>
        <p><span class="stat">Region:</span> ${filteredCountryArr[0].region}</p>
        <p><span class="stat">Sub Region:</span> ${countryExtraDetails[0].subregion ?? countryExtraDetails[0].region}</p>
        <p><span class="stat">Capital:</span> ${filteredCountryArr[0].capital}</p>
      </div>
      <div class="additional-info | info">
        <p><span class="stat">Top Level Domain:</span> ${countryExtraDetails[0].tld.join(", ")}</p>
        <p><span class="stat">Currencies:</span> ${currencies()}</p>
        <p><span class="stat">Languages:</span> ${Object.values(countryExtraDetails[0].languages).join(", ")}</p>
      </div>
      <div class="border-countries">
        <h2>Border Countries:</h2>
        <div class="border-countries-btns">
          ${countryExtraDetails[0].borders.map(border => `<button type="button" data-iso-code="${border}">${border}</button>`).join("") || `None`}
        </div>
      </div>
    </div>`
}

// details generator from iso code
function countryDetailsGeneratorIsoCode(filteredCountryArr, countryExtraDetails, currencies) {
  detailsWrapper.innerHTML =
    `<img src="${filteredCountryArr[0].flags.svg}" alt="Flag of ${filteredCountryArr[0].name.common}">
    <div class="end-col">
      <div class="info">
        <h2>${filteredCountryArr[0].name.common}</h2>
        <p><span class="stat">Native Name:</span> ${Object.values(filteredCountryArr[0].name.nativeName)[0].common}</p>
        <p><span class="stat">Population:</span> ${filteredCountryArr[0].population.toLocaleString()}</p>
        <p><span class="stat">Region:</span> ${filteredCountryArr[0].region}</p>
        <p><span class="stat">Sub Region:</span> ${countryExtraDetails.subregion ?? countryExtraDetails.region}</p>
        <p><span class="stat">Capital:</span> ${filteredCountryArr[0].capital}</p>
      </div>
      <div class="additional-info | info">
        <p><span class="stat">Top Level Domain:</span> ${countryExtraDetails.tld.join(", ")}</p>
        <p><span class="stat">Currencies:</span> ${currencies()}</p>
        <p><span class="stat">Languages:</span> ${Object.values(countryExtraDetails.languages).join(", ")}</p>
      </div>
      <div class="border-countries">
        <h2>Border Countries:</h2>
        <div class="border-countries-btns">
          ${countryExtraDetails.borders.map(border => `<button type="button" data-iso-code="${border}">${border}</button>`).join("") || `None`}
        </div>
      </div>
    </div>`
}

// show details section hide the homepage 
function openDetails() {
  document.documentElement.style.scrollBehavior = "auto";
  document.documentElement.scrollTop = 0;
  controlsSection.classList.toggle("hidden");
  cardsWrapper.classList.toggle("hidden");
  details.classList.toggle("hidden");
}


function themeHandeler() {
  document.body.classList.toggle("dark-theme");
  darkIcon.classList.toggle("hidden");
  lightIcon.classList.toggle("hidden");
  darkSpan.classList.toggle("hidden");
  lightSpan.classList.toggle("hidden");
}

// initial api fetch 
(async () => {
  let allcountries = await fetchCountries();
  countries = await allcountries.filter(country => country.name.common !== "Israel")
  // console.log(countries)
  generateCards(countries);
})();




// initial theme set from local storage
const isDark = JSON.parse(localStorage.getItem("isDark")) ?? false;
console.log("dark theme: ", isDark);
if (isDark) {
  document.body.classList.add("dark-theme");
  darkIcon.classList.add("hidden");
  lightIcon.classList.remove("hidden");
  darkSpan.classList.add("hidden");
  lightSpan.classList.remove("hidden");
};

// dark theme toggle
themeBtn.addEventListener("click", () => {

  themeHandeler();
  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("isDark", JSON.stringify(true));
  } else {
    localStorage.setItem("isDark", JSON.stringify(false));
  }
});

// filter by region toggle
filterByRegionBtn.addEventListener("click", (e) => {
  regionsWrapper.classList.toggle("hidden");
});

// click outside the regions wrapper to close it
document.addEventListener("click", (e) => {
  if (regionsWrapper.classList.contains("hidden")) return;
  if (!regionsWrapper.contains(e.target)
    && e.target !== regionBtn
    && e.target !== filterByRegionBtn) {
    regionsWrapper.classList.add("hidden");
  }
});

// filter by region
regionsWrapper.addEventListener("click", (e) => {

  const continent = e.target.dataset.region;
  if (!continent) return;

  if (continent !== "All") {
    let filteredCountries = countries.filter(country => country.region === continent);
    generateCards(filteredCountries);
  } else {
    generateCards(countries);
  }
});

// search a country
searchInput.addEventListener("input", () => {
  const searchedCountry = document.getElementById('search-input').value;

  let saerchedResult = countries.filter(country => (country.name.common).toLowerCase().includes(searchedCountry.toLowerCase()));
  generateCards(saerchedResult);
});

// scroll back up visible on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 600) {
    scrollBackUp.classList.add("visible-opacity");
  } else {
    scrollBackUp.classList.remove("visible-opacity");
  }
});

// start typing anywhere to type in the search input
document.addEventListener("keydown", (e) => {
  if ("abcdefghijklmnopqrstuvwxyz".includes(e.key)) {
    searchInput.focus();
  }
});

// press escape ou outside to empty the search input
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchInput.value !== "") {
    searchInput.value = "";
    generateCards(countries);
  }
})
document.addEventListener("click", (e) => {
  if (searchInput.value !== ""
    && e.target !== searchInput
    && !cardsWrapper.contains(e.target)) {
    searchInput.value = "";
    generateCards(countries);
  }
})

// click a card to show details
cardsWrapper.addEventListener("click", (e) => {

  // save the scroll level when a card is clicked so when we're back to homepage we return where we left off
  saveScrollLevel = window.scrollY;

  const cardBtn = e.target.closest('button[data-country]');
  if (cardBtn && e.target !== cardsWrapper) {
    
    document.startViewTransition(() => {
      
      openDetails();
  
      let selectedCountry = (cardBtn.dataset.country).split("-").join(" ");
      // exceptions for these two because the - is in the name not added
      if (selectedCountry === "Timor Leste"
        || selectedCountry === "Guinea Bissau") {
        selectedCountry = cardBtn.dataset.country;
      }
  
      let countryExtraDetails = [];
      fetchShowDetails(countryExtraDetails, selectedCountry);
    })
  }
  // set to run before the next paint
  requestAnimationFrame(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  });
})

// back to homepage button
backBtn.addEventListener("click", () => {
  
  document.startViewTransition(() => {
    
    controlsSection.classList.toggle("hidden");
    cardsWrapper.classList.toggle("hidden");
    details.classList.toggle("hidden");
    detailsWrapper.innerHTML = "";
  
    document.documentElement.style.scrollBehavior = "auto";
    document.documentElement.scrollTo(0, saveScrollLevel);
    
    // set to run before the next paint
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    });
  })
})

// click the border countries to see their details
detailsWrapper.addEventListener("click", (e) => {

  document.startViewTransition(() => {
    
    const borderCountryBtn = e.target.closest('button[data-iso-code]');
    if (e.target === borderCountryBtn) {
      let countryExtraDetails;
      let selectedCountryIsoCode = e.target.dataset.isoCode;
  
      fetchShowDetailsIsoCode(countryExtraDetails, selectedCountryIsoCode);
    }
  })
})

