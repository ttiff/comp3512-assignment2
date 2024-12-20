import { fetchAndStoreData, isFavorite, getFavorites } from './dataUtils.js';
import { sortData, getFlagUrl, getCountryCodeByCountry, createDetailParagraph, createInfoLink } from './utils.js';
import { createQualifyingResultsTable, createTop3RacersTable, createFinalResultsTable } from './tableUtils.js';
import { displayCircuitPopup } from './popupUtils.js';
import { setupMainContainer, createMainGrid, createTableContainer, createRaceListColumn, createDetailsColumn, addFavoritesSection } from './domUtils.js';

/**
  This module manages the rendering and interactive features of the browse view in the SPA
 */

export let races = null;
export let qualifyingResults = null;
export let results = null;

// Fetches race, qualifying, and result data for the selected season, processes the data, and renders the race list and details sections
export async function renderRaces(seasonYear) {
    const browseView = document.querySelector("#browse");
    browseView.innerHTML = "";
    const spinner = document.querySelector("#loadingSpinner");
    spinner.style.display = "block";

    const mainContainer = setupMainContainer();
    const mainGrid = createMainGrid(browseView);
    const raceGrid = createRaceListColumn(mainGrid, seasonYear);

    try {
        const racesUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${seasonYear}`;
        const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season=${seasonYear}`;
        const resultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season=${seasonYear}`;

        const resultsArray = await Promise.all([
            fetchAndStoreData(racesUrl),
            fetchAndStoreData(qualifyingUrl),
            fetchAndStoreData(resultsUrl),
        ]);

        races = sortData(resultsArray[0], "round");
        qualifyingResults = sortData(resultsArray[1], "position");
        results = sortData(resultsArray[2], "position");

        if (races) {
            renderRaceList(raceGrid, races, qualifyingResults, results);
        } else {
            alert("No races found for the selected season.");
        }
    } catch (error) {
        console.error("Error loading races:", error);
        alert("Failed to load race data. Please try again later.");
    } finally {
        spinner.style.display = "none";
    }

    createDetailsColumn(mainGrid, seasonYear);
}

// Iterates over the race data and generates individual race cards for each race in the grid layout
export function renderRaceList(raceGrid, races, qualifyingResults, results) {
    races.forEach(race => createRaceCard(raceGrid, race, qualifyingResults, results));
}

//  Creates a card element for a specific race, displaying basic details and providing buttons for detailed results.
function createRaceCard(raceGrid, race, qualifyingResults, results) {
    const raceColumn = document.createElement("div");
    raceColumn.className = "column";
    raceColumn.setAttribute("race-id", race.id);
    raceGrid.appendChild(raceColumn);

    const card = document.createElement("div");
    card.className = "ui card";
    raceColumn.appendChild(card);

    const contentDiv = document.createElement("div");
    contentDiv.className = "content";
    card.appendChild(contentDiv);

    const raceHeader = document.createElement("div");
    raceHeader.className = "header";
    raceHeader.textContent = `Round ${race.round}`;
    contentDiv.appendChild(raceHeader);

    const meta = document.createElement("div");
    meta.className = "meta";

    const raceName = document.createElement("span");
    raceName.textContent = race.name;
    meta.appendChild(raceName);

    const raceHeartIcon = document.createElement("i");
    raceHeartIcon.className = isFavorite("circuits", race.id)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";
    meta.appendChild(raceHeartIcon);

    contentDiv.appendChild(meta);

    const extraContent = document.createElement("div");
    extraContent.className = "extra content";
    card.appendChild(extraContent);

    const resultsButton = document.createElement("a");
    resultsButton.className = "ui tiny button fluid";
    resultsButton.href = "#";
    resultsButton.textContent = "Results";
    extraContent.appendChild(resultsButton);

    resultsButton.addEventListener("click", () => {
        displayRaceDetails(race, results);
        displayQualifyResults(race.id, qualifyingResults, results);
        displayTop3Racers(race.id, results);
        displayFinalResults(race.id, results);
    });
}

// Displays detailed information about a selected race
export function displayRaceDetails(race, results) {
    const detailsColumn = document.querySelector(".eleven.wide.column");
    detailsColumn.textContent = ""; // Clear existing details

    const segment = document.createElement("div");
    segment.className = "ui segment";
    detailsColumn.appendChild(segment);

    const title = document.createElement("h2");
    title.textContent = "Race Details";
    segment.appendChild(title);

    segment.appendChild(createDetailParagraph("Race Name", race.name));
    segment.appendChild(createDetailParagraph("Round", race.round));

    // Create a paragraph for the Circuit Name
    const circuitParagraph = document.createElement("p");

    const circuitLabel = document.createElement("span");
    circuitLabel.className = "label-bold";
    circuitLabel.textContent = "Circuit Name: ";

    const circuitLink = document.createElement("a");
    circuitLink.href = "#";
    circuitLink.textContent = race.circuit.name;
    circuitLink.addEventListener("click", (e) => {
        e.preventDefault();
        displayCircuitPopup(race);
    });

    circuitParagraph.appendChild(circuitLabel);
    circuitParagraph.appendChild(circuitLink);

    segment.appendChild(circuitParagraph);

    segment.appendChild(createDetailParagraph("Location", race.circuit.location));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Country: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${race.circuit.country}`;

    const countryCode = getCountryCodeByCountry(race.circuit.country);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${race.circuit.country} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    segment.appendChild(countryParagraph);

    segment.appendChild(createDetailParagraph("Date of Race", race.date));

    const infoLink = createInfoLink("Race Information", race.url);
    segment.appendChild(infoLink);
}

// Displays a table of qualifying results for the selected race
export function displayQualifyResults(raceId, qualifyingResults, results) {
    const filteredResults = qualifyingResults.filter(qr => qr.race.id === raceId);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".eleven.wide.column");
        const segment = document.createElement("div");
        segment.className = "ui two column grid";

        const divTable = createTableContainer("Qualifying Results");
        const table = createQualifyingResultsTable(filteredResults, results);
        divTable.appendChild(table);

        segment.appendChild(divTable);
        detailsColumn.appendChild(segment);
    } else {
        console.warn(`No qualifying results found for race ID ${raceId}`);
    }
}
// Displays a table of top 3 finishers for the selected race 
export function displayTop3Racers(raceId, results) {
    const filteredResults = results.filter(r => r.race.id === raceId && r.position <= 3);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".ui.two.column.grid");
        const segment = document.createElement("div");
        segment.classList = "column top3";
        const divTable = createTableContainer("Top 3 Racers");
        const table = createTop3RacersTable(filteredResults, results);
        divTable.appendChild(table);

        segment.appendChild(divTable);
        detailsColumn.appendChild(segment);
    } else {
        console.warn(`No top 3 racers found for race ID ${raceId}`);
    }
}

//Displays a table of race results for the selected race
export function displayFinalResults(raceId, results) {
    const filteredResults = results.filter(r => r.race.id === raceId);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".column.top3");
        const divTable = createTableContainer("Race Results");
        const table = createFinalResultsTable(filteredResults, results);
        divTable.appendChild(table);
        detailsColumn.appendChild(divTable);
    } else {
        console.warn(`No final results found for race ID ${raceId}`);
    }
}

// Updates all race-related tables (details, qualifying, top 3 racers, and final results) for a selected race ID.
export function updateRaceTables(raceId) {
    displayRaceDetails(races.find(r => r.id === raceId), results);
    displayQualifyResults(raceId, qualifyingResults, results);
    displayTop3Racers(raceId, results);
    displayFinalResults(raceId, results);
}

//  Generates a lookup table for circuits, drivers, and constructors based on the results data
function createLookup(results) {
    if (!Array.isArray(results)) {
        return { circuits: {}, drivers: {}, constructors: {} };
    }

    const lookups = {
        circuits: {},
        drivers: {},
        constructors: {},
    };

    results.forEach(result => {
        if (result.race && result.race.id && result.race.name) {
            lookups.circuits[result.race.id] = result.race.name;
        }
        if (result.driver && result.driver.id) {
            lookups.drivers[result.driver.id] = `${result.driver.forename} ${result.driver.surname}`;
        }
        if (result.constructor && result.constructor.id) {
            lookups.constructors[result.constructor.id] = result.constructor.name;
        }
    });

    return lookups;
}

// Displays a popup with the user's favorite circuits, drivers, and constructors
export function displayFavoritesPopup() {
    const favoritesPopup = document.querySelector("#favorites-popup");
    const overlay = document.querySelector("#modal-overlay");

    favoritesPopup.innerHTML = "";

    const closeButton = document.createElement("button");
    closeButton.className = "close-button-top";
    closeButton.textContent = "✖";
    closeButton.addEventListener("click", () => {
        favoritesPopup.style.display = "none";
        overlay.style.display = "none";
    });
    favoritesPopup.appendChild(closeButton);

    const favorites = getFavorites();

    if (!favorites || favorites.length === 0) {
        const noFavoritesMessage = document.createElement("p");
        noFavoritesMessage.textContent = "You haven't added any favorites yet.";
        favoritesPopup.appendChild(noFavoritesMessage);

    } else {
        const lookups = createLookup(results);

        addFavoritesSection(favoritesPopup, "Circuits", favorites.circuits, lookups.circuits);
        addFavoritesSection(favoritesPopup, "Drivers", favorites.drivers, lookups.drivers);
        addFavoritesSection(favoritesPopup, "Constructors", favorites.constructors, lookups.constructors);
    }

    favoritesPopup.style.display = "block";
    overlay.style.display = "block";
}
