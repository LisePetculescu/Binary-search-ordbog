// import binarySearch from "./binarysearch.js";

window.addEventListener("load", start);

const endpoint = "http://localhost:8080/ordbogen";
let dicMin;
let dicMax;

function start() {
  getSizes();

  document.getElementById("search-form").addEventListener("submit", dictionarySearch);
  //   dictionarySearch();
}

async function getSizes() {
  const json = await fetch(endpoint).then((response) => response.json());
  dicMin = json.min;
  dicMax = json.max;
  return json;
}

async function getEntryAt(index) {
  const entry = await fetch(`${endpoint}/${index}`).then((resp) => resp.json());
  console.log("entry: ", entry);

  return entry;
}

async function dictionarySearch(event) {
  event.preventDefault();

  const searchTerm = document.querySelector("#search-input").value.trim().toLowerCase();
  console.log("Search term:", searchTerm);

  if (searchTerm === "") {
    alert("Skriv venligst et ord");
    return;
  }

  const result = await search(searchTerm);
  console.log(result);

  if (result === -1) {
    document.querySelector("#show-word").insertAdjacentHTML("afterbegin", /*html*/ `<p>Ordet: ${searchTerm} blev ikke fundet</p>`);
  } else {
    document.querySelector("#show-word").insertAdjacentHTML(
      "afterbegin",
      /*html*/ `
        <h2>Headword: ${result.headword}</h2>
        <p>Homograph: ${result.homograph}</p>
        <p>Inflected: ${result.inflected}</p>
        <p>Part of speech: ${result.partofspeech}</p>
        <p>Id: ${result.id}</p>
        </br>
        `
    );
  }
}

async function search(searchWord) {
  let localMin = dicMin;
  let localMax = dicMax;
  let middle;
  let iterations = 0;
  let time;
  const startTime = performance.now();

  console.log(searchWord);

  while (localMin <= localMax) {
    middle = Math.floor((localMin + localMax) / 2);
    iterations++;

    document.querySelector("#iterations").innerHTML = iterations;

    console.log(middle);
    const entryWord = await getEntryAt(middle);
    console.log(entryWord);

    time = performance.now();
    const totalTime = (time - startTime) / 1000;
    document.querySelector("#total-time").innerHTML = totalTime.toFixed(2);

    const comparison = entryWord.inflected.localeCompare(searchWord);

    if (comparison === 0) {
      return entryWord;
    } else if (comparison > 0) {
      localMax = middle - 1;
    } else if (comparison < 0) {
      localMin = middle + 1;
    }


    // used while testing so i didn't get an infinite loop
    // if (iterations >= 21) {
    //     console.error("wow");
    //   return;
    // }
  }


  // returns -1 if the search values isn't found in the array
  return -1;
}
