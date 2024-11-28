import { createNavigationBar, switchStylesheet } from "./script.js";
import { fetchAndStoreData, updateStorage, removeStorage, retrieveStorage, fetchDriverDetails, fetchConstructorDetails } from './dataUtils.js';


// // Sample data for races; replace with API data when available

const constructorResults = [
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 }
];

const driverResults = [
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", round: 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", round: 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 }

];

export async function renderRaces(seasonYear) {
    const browseView = document.querySelector("#browse");
    browseView.innerHTML = ""; // Clear existing browse view content

    const mainContainer = setupMainContainer();
    const mainGrid = createMainGrid(browseView);
    const raceGrid = createRaceListColumn(mainGrid, seasonYear);

    try {
        // Fetch race data for the selected season
        const racesUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/races.php?season=${seasonYear}`;
        const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?season=${seasonYear}`;
        const resultsUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?season=${seasonYear}`;

        const resultsArray = await Promise.all([
            fetchAndStoreData(racesUrl),
            fetchAndStoreData(qualifyingUrl),
            fetchAndStoreData(resultsUrl)
        ]);

        const races = resultsArray[0];
        const qualifyingResults = resultsArray[1];
        const results = resultsArray[2];


        if (races) {
            renderRaceList(raceGrid, races, qualifyingResults, results);
        } else {
            alert("No races found for the selected season.");
        }
    } catch (error) {
        console.error("Error loading races:", error);
        alert("Failed to load race data. Please try again later.");
    }

    createDetailsColumn(mainGrid, seasonYear);
}

// Function to set up the main container
function setupMainContainer() {
    const mainContainer = document.querySelector("main");
    mainContainer.className = "ui fluid container";
    return mainContainer;
}

// Function to create the main grid layout
function createMainGrid(parent) {
    const mainGrid = document.createElement("div");
    mainGrid.className = "ui grid stackable";
    parent.appendChild(mainGrid);
    return mainGrid;
}

// Function to create the left column for race list
function createRaceListColumn(parent, seasonYear) {
    const raceListColumn = document.createElement("div");
    raceListColumn.className = "four wide column";
    parent.appendChild(raceListColumn);

    const header = document.createElement("h1");
    header.className = "ui centered header";
    header.textContent = `${seasonYear} Races`;
    raceListColumn.appendChild(header);

    const raceGrid = document.createElement("div");
    raceGrid.className = "ui stackable doubling three column grid";
    raceGrid.id = "race-grid";
    raceListColumn.appendChild(raceGrid);

    return raceGrid;
}

// // Function to create each race card
// function createRaceCard(raceGrid, race) {
//     console.log(race);
//     const raceColumn = document.createElement("div");
//     raceColumn.className = "column";
//     raceGrid.appendChild(raceColumn);

//     const card = document.createElement("div");
//     card.className = "ui card";
//     raceColumn.appendChild(card);

//     const contentDiv = document.createElement("div");
//     contentDiv.className = "content";
//     card.appendChild(contentDiv);

//     const raceHeader = document.createElement("div");
//     raceHeader.className = "header";
//     raceHeader.textContent = `Round ${race.round}`;
//     contentDiv.appendChild(raceHeader);

//     const meta = document.createElement("div");
//     meta.className = "meta";
//     meta.textContent = race.name;
//     contentDiv.appendChild(meta);

//     const extraContent = document.createElement("div");
//     extraContent.className = "extra content";
//     card.appendChild(extraContent);

//     const resultsButton = document.createElement("a");
//     resultsButton.className = "ui tiny button fluid";
//     resultsButton.href = `#`; //replace with eventhandler
//     resultsButton.textContent = "Results";
//     extraContent.appendChild(resultsButton);

//     resultsButton.addEventListener("click", async () => {
//         displayRaceDetails(race);
//         await displayQualifyResults(race.id);
//         await displayTop3Racers(race.id);
//         await displayFinalResults(race.id);
//     });
// }

function createRaceCard(raceGrid, race, qualifyingResults, results) {
    const raceColumn = document.createElement("div");
    raceColumn.className = "column";
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
    meta.textContent = race.name;
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
        displayRaceDetails(race);
        displayQualifyResults(race.id, qualifyingResults);
        displayTop3Racers(race.id, results);
        displayFinalResults(race.id, results);
        console.log(qualifyingResults);
    });
}


// Function to filter races by season and render race cards
// function renderRaceList(raceGrid, races) {
//     // const seasonRaces = races.filter(race => race.year === seasonYear);
//     // seasonRaces.forEach(race => createRaceCard(raceGrid, race));
//     races.forEach(race => createRaceCard(raceGrid, race));
// }

function renderRaceList(raceGrid, races, qualifyingResults, results) {
    races.forEach(race => createRaceCard(raceGrid, race, qualifyingResults, results));
}


// Function to create the right column for the details message
function createDetailsColumn(parent, seasonYear) {
    const detailsColumn = document.createElement("div");
    detailsColumn.className = "eleven wide column";
    parent.appendChild(detailsColumn);

    const segment = document.createElement("div");
    segment.className = "ui segment";
    detailsColumn.appendChild(segment);

    const message = document.createElement("p");
    message.textContent = message.textContent = `Please select a circuit to view details and race results for the ${seasonYear} season.`;
    segment.appendChild(message);
}

// Function to display detailed information for a selected race
function displayRaceDetails(race) {
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
    segment.appendChild(createDetailParagraph("Circuit Name", race.circuit.name));
    segment.appendChild(createDetailParagraph("Location", race.circuit.location));
    segment.appendChild(createDetailParagraph("Country", race.circuit.country));
    segment.appendChild(createDetailParagraph("Date of Race", race.date));

    const infoLink = createInfoLink("Race Information", race.url);
    segment.appendChild(infoLink);
}
// Function to display the qualifying results for selected race
// function displayQualifyResults(qualifyingResults) {
//     const detailsColumn = document.querySelector(".eleven.wide.column");
//     const segment = document.createElement("div");
//     segment.className = "ui two column grid";

//     const divTable = createTableContainer("Qualifying Results");

//     // Create and append the table
//     const table = createQualifyingResultsTable(qualifyingResults);
//     divTable.appendChild(table);

//     // Append to segment and details column
//     segment.appendChild(divTable);
//     detailsColumn.appendChild(segment);
// }

// async function displayQualifyResults(raceId) {
//     const qualifyingUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/qualifying.php?race=${raceId}`;
//     const qualifyingResults = await fetchAndStoreData(qualifyingUrl);

//     if (qualifyingResults) {
//         const detailsColumn = document.querySelector(".eleven.wide.column");
//         const segment = document.createElement("div");
//         segment.className = "ui two column grid";

//         const divTable = createTableContainer("Qualifying Results");
//         const table = createQualifyingResultsTable(qualifyingResults);
//         divTable.appendChild(table);

//         segment.appendChild(divTable);
//         detailsColumn.appendChild(segment);
//     }
// }

function displayQualifyResults(raceId, qualifyingResults) {
    const filteredResults = qualifyingResults.filter(qr => qr.race.id === raceId);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".eleven.wide.column");
        const segment = document.createElement("div");
        segment.className = "ui two column grid";

        const divTable = createTableContainer("Qualifying Results");
        const table = createQualifyingResultsTable(filteredResults);
        divTable.appendChild(table);

        segment.appendChild(divTable);
        detailsColumn.appendChild(segment);
    } else {
        console.warn(`No qualifying results found for race ID ${raceId}`);
    }
}



// async function displayTop3Racers(raceId) {

//     const finalUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
//     const finalResults = await fetchAndStoreData(finalUrl);
//     const top3Racers = finalResults.filter(result => result.position <= 3)
//     console.log(top3Racers);

//     const detailsColumn = document.querySelector(".ui.two.column.grid");
//     const segment = document.createElement("div");
//     segment.classList = "column top3";
//     const divTable = createTableContainer("Top 3 Racers");

//     const table = createTop3RacersTable(top3Racers);
//     divTable.appendChild(table);

//     segment.appendChild(divTable);
//     detailsColumn.appendChild(segment);
// }

function displayTop3Racers(raceId, results) {
    const filteredResults = results.filter(r => r.race.id === raceId && r.position <= 3);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".ui.two.column.grid");
        const segment = document.createElement("div");
        segment.classList = "column top3";
        const divTable = createTableContainer("Top 3 Racers");
        const table = createTop3RacersTable(filteredResults);
        divTable.appendChild(table);

        segment.appendChild(divTable);
        detailsColumn.appendChild(segment);
    } else {
        console.warn(`No top 3 racers found for race ID ${raceId}`);
    }
}


// async function displayFinalResults(raceId) {
//     const finalUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/results.php?race=${raceId}`;
//     const finalResults = await fetchAndStoreData(finalUrl);
//     const detailsColumn = document.querySelector(".column.top3");
//     const divTable = createTableContainer("Race Results");
//     const table = createFinalResultsTable(finalResults);
//     divTable.append(table);
//     detailsColumn.appendChild(divTable);
// }

function displayFinalResults(raceId, results) {
    const filteredResults = results.filter(r => r.race.id === raceId);

    if (filteredResults.length > 0) {
        const detailsColumn = document.querySelector(".column.top3");
        const divTable = createTableContainer("Race Results");
        const table = createFinalResultsTable(filteredResults);
        divTable.appendChild(table);
        detailsColumn.appendChild(divTable);
    } else {
        console.warn(`No final results found for race ID ${raceId}`);
    }
}


function createTableContainer(titleText) {
    const divTable = document.createElement("div");
    divTable.className = "column";

    const title = document.createElement("h3");
    title.textContent = titleText;
    divTable.appendChild(title);

    return divTable;
}

function createQualifyingResultsTable(qualifyingResults) {
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver", "Constructor", "Q1", "Q2", "Q3"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createQualifyingTableBody(qualifyingResults);
    table.appendChild(tbody);

    return table;
}

function createTop3RacersTable(top3Racers) {
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createTop3RacersTableBody(top3Racers);
    table.appendChild(tbody);

    return table;

}

function createFinalResultsTable(finalResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver", "Constructor", "Laps", "Points"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createFinalResultsTableBody(finalResults);
    table.appendChild(tbody);

    return table;

}

function createTableHeaders(headers) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
}


function createQualifyingTableBody(qualifyingResults) {
    console.log("QUALIFYING");
    console.log(qualifyingResults);
    const tbody = document.createElement("tbody");

    qualifyingResults.forEach(result => {
        console.log(result.driver.ref)
        console.log(result.race.year)
        const row = document.createElement("tr");

        row.appendChild(createCell(result.position));
        // row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, ""));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.ref, result.race.year));
        // row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id));

        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, qualifyingResults));
        row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id, qualifyingResults));

        row.appendChild(createCell(result.q1));
        row.appendChild(createCell(result.q2));
        row.appendChild(createCell(result.q3));

        tbody.appendChild(row);
    });

    return tbody;
}

function createTop3RacersTableBody(top3Racers) {
    const tbody = document.createElement("tbody");
    top3Racers.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.position));
        // row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, ""));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.driverRef, result.driver.year));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.ref, result.race.year));
        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, top3Racers));

        tbody.appendChild(row)
    });

    return tbody
}


function createFinalResultsTableBody(finalResults) {
    const tbody = document.createElement("tbody");
    console.log('HEEERE');
    console.log(finalResults);
    finalResults.forEach(result => {
        console.log('YEAAAAAAAAAAR');
        console.log(result.race.year);
        console.log(result.driver.ref);
        console.log(result);
        const row = document.createElement("tr");
        row.appendChild(createCell(result.position));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.driverRef, result.driver.year));
        // row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, null, result.driver.ref, result.race.year));

        // // row.appendChild(createLinkCell(result.constructor, "", false, true));
        // row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id));

        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, finalResults));
        row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id, finalResults));

        row.appendChild(createCell(result.laps));
        row.appendChild(createCell(result.points));

        tbody.appendChild(row)
    });

    return tbody

}

function createConstructorTableBody(results) {
    const tbody = document.createElement("tbody");
    results.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.round));
        row.appendChild(createCell(result.circuit));
        row.appendChild(createCell(`${result.forename} ${result.surname}`));
        row.appendChild(createCell(result.position));
        row.appendChild(createCell(result.points));

        tbody.appendChild(row)
    });

    return tbody

}

function createDriversTableBody(results) {
    const tbody = document.createElement("tbody");
    results.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.round));
        row.appendChild(createCell(result.circuit));
        row.appendChild(createCell(result.position));
        row.appendChild(createCell(result.points));

        tbody.appendChild(row)
    });

    return tbody

}

function createCell(textContent) {
    const cell = document.createElement("td");
    cell.textContent = textContent;
    return cell;
}

// function createLinkCell(textContent, href) {
//     const cell = document.createElement("td");
//     const link = document.createElement("a");
//     link.className = "underline-link";
//     link.href = href;
//     link.textContent = textContent;
//     cell.appendChild(link);
//     return cell;
// }


// function createLinkCell(textContent, href, isDriver = false, isConstructor = false, id = null, driverRef = null, season = null) {
//     const cell = document.createElement("td");
//     const link = document.createElement("a");
//     link.className = "underline-link";
//     link.href = href;
//     link.textContent = textContent;

//     // If it's a driver link, add a click event
//     if (isDriver && driverRef) {
//         link.addEventListener("click", async (e) => {
//             e.preventDefault(); // Prevent default link behavior
//             const driverDetails = await fetchDriverDetails(driverRef, season);
//             console.log("driver details");
//             console.log(driverDetails);
//             if (driverDetails) {
//                 displayDriverPopup(driverDetails);
//             } else {
//                 alert("Failed to load driver details.");
//             }
//         });
//     }

//     // If it's a constructor link, add a click event
//     if (isConstructor && id) {
//         link.addEventListener("click", async (e) => {
//             e.preventDefault(); // Prevent default link behavior
//             const constructorDetails = await fetchConstructorDetails(id);
//             if (constructorDetails) {
//                 displayConstructorPopup(constructorDetails);
//             } else {
//                 alert("Failed to load constructor details.");
//             }
//         });
//     }

//     cell.appendChild(link);
//     return cell;
// }


function createLinkCell(
    textContent,
    href,
    isDriver = false,
    isConstructor = false,
    id,
    results
) {
    const cell = document.createElement("td");
    const link = document.createElement("a");
    link.className = "underline-link";
    link.href = href;
    link.textContent = textContent;

    // Driver link
    if (isDriver) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            displayDriverPopup(id, results);
        });
    }

    // Constructor link
    if (isConstructor) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            displayConstructorPopup(id, results);
        });
    }

    cell.appendChild(link);
    return cell;
}


// Function to create a detail paragraph
function createDetailParagraph(labelText, valueText) {
    const paragraph = document.createElement("p");

    const label = document.createElement("span");
    label.className = "label-bold";
    label.textContent = `${labelText}: `;

    const value = document.createElement("span");
    value.textContent = valueText;

    paragraph.appendChild(label);
    paragraph.appendChild(value);

    return paragraph;
}

// Function to create a link element
function createInfoLink(linkText, url) {
    const paragraph = document.createElement("p");

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = linkText;

    paragraph.appendChild(link);

    return paragraph;
}


// Main function to render the races and details message
// export function renderRaces(seasonYear) {
//     const browseView = document.querySelector("#browse");
//     browseView.innerHTML = ""; // Clear existing browse view content
//     const mainContainer = setupMainContainer();

//     createNavigationBar(view => {
//         const homeView = document.querySelector("#home");
//         if (view === "home") {
//             homeView.classList.remove("hidden");
//             browseView.classList.add("hidden");
//             switchStylesheet("home");
//         } else {
//             homeView.classList.add("hidden");
//             browseView.classList.remove("hidden");
//             switchStylesheet("browse");
//         }
//     });

//     const mainGrid = createMainGrid(browseView);
//     const raceGrid = createRaceListColumn(mainGrid, seasonYear);
//     renderRaceList(raceGrid, seasonYear);
//     createDetailsColumn(mainGrid, seasonYear);
// }


// function displayConstructorPopup(id, constructor) {
//     const filteredResults = constructor.filter(qr => qr.race.id === raceId);
//     const constructorPopup = document.querySelector("#constructor");
//     constructorPopup.innerHTML = ""; // Clear previous content
//     const overlay = document.querySelector("#modal-overlay");
//     overlay.style.display = "block";

//     createConstructorDetails(constructor, constructorPopup);

//     const closeButtonTop = document.createElement("button");
//     closeButtonTop.className = "close-button-top";
//     closeButtonTop.textContent = "X";

//     closeButtonTop.addEventListener("click", () => {
//         constructorPopup.style.display = "none";
//         overlay.style.display = "none";
//     });

//     constructorPopup.appendChild(closeButtonTop);

//     const closeButton = document.createElement("button");
//     closeButton.className = "ui button";
//     closeButton.textContent = "Close";
//     closeButton.addEventListener("click", () => {
//         constructorPopup.style.display = "none";
//         overlay.style.display = "none";
//     });
//     constructorPopup.appendChild(closeButton);

//     constructorPopup.style.display = "block";
// }

// function displayConstructorPopup(ref, constructors) {
//     // Filter constructor data for the given ID
//     // const filteredResults = constructors.filter(c => c.id === id);
//     // const filteredResults = constructors.find(c => c.constructor.id === id);
//     // const filteredResults = constructors.find(c => c.constructor.ref === ref);
//     const filteredResults = constructors.filter(c => c.constructor.ref === ref);

//     // const filteredResults = constructors.find(c => Number(c.constructor.id) === Number(id));



//     // console.log("pop up");
//     // console.log(filteredResults);

//     // console.log("Provided ID:", id, "Type:", typeof id);
//     // console.log("Constructors Array:", constructors);
//     // console.log("Constructor IDs:", constructors.map(c => c.constructor.id));

//     if (filteredResults.length > 0) {
//         const constructorPopup = document.querySelector("#constructor");
//         constructorPopup.innerHTML = ""; // Clear previous content
//         const overlay = document.querySelector("#modal-overlay");
//         overlay.style.display = "block";

//         // Display details for the filtered constructor
//         filteredResults.forEach(constructorDetail => {
//             createConstructorDetails(constructorDetail, constructorPopup);
//         });

//         const closeButtonTop = document.createElement("button");
//         closeButtonTop.className = "close-button-top";
//         closeButtonTop.textContent = "X";

//         closeButtonTop.addEventListener("click", () => {
//             constructorPopup.style.display = "none";
//             overlay.style.display = "none";
//         });

//         constructorPopup.appendChild(closeButtonTop);

//         const closeButton = document.createElement("button");
//         closeButton.className = "ui button";
//         closeButton.textContent = "Close";
//         closeButton.addEventListener("click", () => {
//             constructorPopup.style.display = "none";
//             overlay.style.display = "none";
//         });
//         constructorPopup.appendChild(closeButton);

//         constructorPopup.style.display = "block";
//     } else {
//         console.warn(`No constructor found with ID ${id}`);
//     }
// }

function displayConstructorPopup(id, constructors) {
    // Filter constructor data for the given ref
    const filteredResults = constructors.filter(c => c.constructor.id === id);

    if (filteredResults.length > 0) {
        const constructorPopup = document.querySelector("#constructor");
        constructorPopup.innerHTML = ""; // Clear previous content
        const overlay = document.querySelector("#modal-overlay");
        overlay.style.display = "block";

        // Only create details once
        const constructorDetail = filteredResults[0]; // Get the first match (avoid looping unnecessarily)
        createConstructorDetails(constructorDetail, constructorPopup);

        const closeButtonTop = document.createElement("button");
        closeButtonTop.className = "close-button-top";
        closeButtonTop.textContent = "X";

        closeButtonTop.addEventListener("click", () => {
            constructorPopup.style.display = "none";
            overlay.style.display = "none";
        });

        constructorPopup.appendChild(closeButtonTop);

        const closeButton = document.createElement("button");
        closeButton.className = "ui button";
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
            constructorPopup.style.display = "none";
            overlay.style.display = "none";
        });
        constructorPopup.appendChild(closeButton);

        constructorPopup.style.display = "block";
    } else {
        console.warn(`No constructor found with ref ${ref}`);
    }
}



function createConstructorDetails(constructor, targetElement) {
    console.log(constructor)
    const column = document.createElement("div");
    column.className = "twelve wide column"; // Add column class

    const segment = document.createElement("div");
    segment.className = "ui segment";

    const title = document.createElement("h2");
    title.textContent = "Constructor Details";
    segment.appendChild(title);

    //need to update this
    segment.appendChild(createDetailParagraph("Name", constructor.name));
    segment.appendChild(createDetailParagraph("Nationality", constructor.nationality));
    const infoLink = createInfoLink("Constructor Biography", constructor.url);
    segment.appendChild(infoLink);


    column.appendChild(segment);

    targetElement.append(column);

    targetElement.append(createConstructorsTable(constructorResults))
}

function createConstructorsTable(constructorResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Round", "Circuit", "Driver", "Position", "Points"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createConstructorTableBody(constructorResults);
    table.appendChild(tbody);

    return table;
}

// function displayDriverPopup(id, driver) {
//     console.log("DRIVER")
//     console.log(driver);
//     const driverPopup = document.querySelector("#driver");
//     driverPopup.innerHTML = ""; // Clear previous content
//     const overlay = document.querySelector("#modal-overlay");
//     overlay.style.display = "block";

//     createDriverDetails(driver, driverPopup);

//     const closeButtonTop = document.createElement("button");
//     closeButtonTop.className = "close-button-top";
//     closeButtonTop.textContent = "X";

//     closeButtonTop.addEventListener("click", () => {
//         driverPopup.style.display = "none";
//         overlay.style.display = "none";
//     });

//     driverPopup.appendChild(closeButtonTop);

//     const closeButton = document.createElement("button");
//     closeButton.className = "ui button";
//     closeButton.textContent = "Close";
//     closeButton.addEventListener("click", () => {
//         driverPopup.style.display = "none";
//         overlay.style.display = "none";
//     });
//     driverPopup.appendChild(closeButton);

//     driverPopup.style.display = "block";
// }


function displayDriverPopup(id, drivers) {
    console.log("ID received for driver:", id);
    console.log("Available drivers:", drivers);
    const filteredDriver = drivers.find(driver => driver.driver.id === id);
    console.log("Filtered driver:", filteredDriver);

    // Filter driver data for the given ID
    // const filteredDriver = drivers.find(driver => driver.id === id);

    if (filteredDriver) {
        const driverPopup = document.querySelector("#driver");
        driverPopup.innerHTML = ""; // Clear previous content
        const overlay = document.querySelector("#modal-overlay");
        overlay.style.display = "block";

        // Display the details for the selected driver
        createDriverDetails(filteredDriver, driverPopup);

        const closeButtonTop = document.createElement("button");
        closeButtonTop.className = "close-button-top";
        closeButtonTop.textContent = "X";

        closeButtonTop.addEventListener("click", () => {
            driverPopup.style.display = "none";
            overlay.style.display = "none";
        });

        driverPopup.appendChild(closeButtonTop);

        const closeButton = document.createElement("button");
        closeButton.className = "ui button";
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
            driverPopup.style.display = "none";
            overlay.style.display = "none";
        });
        driverPopup.appendChild(closeButton);

        driverPopup.style.display = "block";
    } else {
        console.warn(`No driver found with ID ${id}`);
    }
}

function createDriverDetails(driver, targetElement) {
    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = '../img/profile.png';
    image.alt = `${driver.forename || "Driver"} ${driver.surname || "Image"}`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Driver Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", `${driver.forename} ${driver.surname}`));
    detailsContainer.appendChild(createDetailParagraph("Nationality", driver.nationality));
    detailsContainer.appendChild(createDetailParagraph("Age", calculateAge(driver.dob)));
    const infoLink = createInfoLink("Driver Biography", driver.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);

    targetElement.appendChild(createDriversTable(driverResults || []));
}

function createDriversTable(driverResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Round", "Circuit", "Position", "Points"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createDriversTableBody(driverResults);
    table.appendChild(tbody);

    return table;
}

function calculateAge(dob) {
    if (!dob) return "N/A"; // Handle cases where dob is null or undefined

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the current month/day is before the birth month/day
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}
