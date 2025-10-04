const themeBtn = document.getElementById("theme-btn");
const darkIcon = document.querySelector("#dark-icon");
const lightIcon = document.querySelector("#light-icon");
const darkSpan = document.querySelector("#dark-span");
const lightSpan = document.querySelector("#light-span");

const filterByRegionBtn = document.getElementById("filter-btn");
const regionsWrapper = document.querySelector('.regions-wrapper');


// api fetch 





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
})