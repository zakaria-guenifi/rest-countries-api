const themeBtn = document.getElementById("theme-btn");
const darkIcon = document.querySelector("#dark-icon");
const lightIcon = document.querySelector("#light-icon");
const darkSpan = document.querySelector("#dark-span");
const lightSpan = document.querySelector("#light-span");

const searchInput = document.getElementById('search-input');

const filterByRegionBtn = document.getElementById("filter-btn");
const regionsWrapper = document.querySelector('.regions-wrapper');
const regionBtn = document.querySelector('.regions-wrapper button');

const cardsWrapper = document.querySelector('.cards-wrapper');

const scrollBackUp = document.querySelector('.scroll-back-up');

let countries = [];

async function fetchCountries() {
  try {
    console.time("fetchCountries");
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.timeEnd("fetchCountries");
    // console.log(data);
    return data;

  } catch (error) {
    console.error(error.message);
  }
};

function generateCards(countries) {

  let cardsHTML = countries.map(country => {

    return `<article class="card" aria-label="${country.name.common}">
              <button type="button" class="card-button" data-country="${country.name.common}">
                  <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
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
// initial api fetch 
(async () => {
  let allcountries = await fetchCountries();
  countries = await allcountries.filter(country => country.name.common !== "Israel")
  // console.log(countries)
  generateCards(countries);
})();


// dark theme toggle
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  darkIcon.classList.toggle("hidden");
  lightIcon.classList.toggle("hidden");
  darkSpan.classList.toggle("hidden");
  lightSpan.classList.toggle("hidden");
});

// filter by region toggle
filterByRegionBtn.addEventListener("click", () => {
  regionsWrapper.classList.toggle("hidden");
});

// click outside the regions wrapper to close it
document.addEventListener("click", (e) => {
  if (regionsWrapper.classList.contains("hidden")) return;
  if (!regionsWrapper.contains(e.target) 
    && e.target !== regionBtn
    && e.target !== filterByRegionBtn) {
    console.log('clicked outside');
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
  if (window.scrollY > 500) {
    scrollBackUp.classList.remove("hidden");
  } else {
    scrollBackUp.classList.add("hidden");
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