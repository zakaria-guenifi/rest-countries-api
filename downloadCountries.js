// fetch-countries.js
import fs from "fs";
import fetch from "node-fetch";

const url = "https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,capital,population,tld,currencies,languages,borders";

async function downloadCountries() {
  try {
    console.log("Fetching countries...");
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Save to local file
    fs.writeFileSync("./countries.json", JSON.stringify(data, null, 2));
    console.log("Saved countries.json with", data.length, "entries");
  } catch (error) {
    console.error("Failed to fetch countries:", error.message);
  }
}

downloadCountries();
