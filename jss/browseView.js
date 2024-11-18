import { createNavigationBar, switchStylesheet } from "./script.js";

// Sample data for races; replace with API data when available
const races = [
    // 2020
    { "raceName": "Austrian Grand Prix", "year": "2020", "round": 1, "circuit": "Red Bull Ring", "location": "Spielberg", "country": "Austria", "date": "2020-07-05", "url": "https://youtube.com" },
    { "raceName": "Styrian Grand Prix", "year": "2020", "round": 2, "circuit": "Red Bull Ring", "location": "Spielberg", "country": "Austria", "date": "2020-07-12", "url": "https://youtube.com" },
    { "raceName": "Hungarian Grand Prix", "year": "2020", "round": 3, "circuit": "Hungaroring", "location": "Mogyoród", "country": "Hungary", "date": "2020-07-19", "url": "https://youtube.com" },
    // 2021
    { "raceName": "Bahrain Grand Prix", "year": "2021", "round": 1, "circuit": "Bahrain International Circuit", "location": "Sakhir", "country": "Bahrain", "date": "2021-03-28", "url": "https://youtube.com" },
    { "raceName": "Emilia Romagna Grand Prix", "year": "2021", "round": 2, "circuit": "Autodromo Enzo e Dino Ferrari", "location": "Imola", "country": "Italy", "date": "2021-04-18", "url": "https://youtube.com" },
    { "raceName": "Portuguese Grand Prix", "year": "2021", "round": 3, "circuit": "Autódromo Internacional do Algarve", "location": "Portimão", "country": "Portugal", "date": "2021-05-02", "url": "https://youtube.com" },
    // 2022
    { "raceName": "Bahrain Grand Prix", "year": "2022", "round": 1, "circuit": "Bahrain International Circuit", "location": "Sakhir", "country": "Bahrain", "date": "2022-03-20", "url": "https://youtube.com" },
    { "raceName": "Saudi Arabian Grand Prix", "year": "2022", "round": 2, "circuit": "Jeddah Corniche Circuit", "location": "Jeddah", "country": "Saudi Arabia", "date": "2022-03-27", "url": "https://youtube.com" },
    { "raceName": "Australian Grand Prix", "year": "2022", "round": 3, "circuit": "Albert Park Circuit", "location": "Melbourne", "country": "Australia", "date": "2022-04-10", "url": "https://youtube.com" },
    // 2023
    { "raceName": "Bahrain Grand Prix", "year": "2023", "round": 1, "circuit": "Bahrain International Circuit", "location": "Sakhir", "country": "Bahrain", "date": "2023-03-05", "url": "https://youtube.com" },
    { "raceName": "Saudi Arabian Grand Prix", "year": "2023", "round": 2, "circuit": "Jeddah Corniche Circuit", "location": "Jeddah", "country": "Saudi Arabia", "date": "2023-03-19", "url": "https://youtube.com" },
    { "raceName": "Australian Grand Prix", "year": "2023", "round": 3, "circuit": "Albert Park Circuit", "location": "Melbourne", "country": "Australia", "date": "2023-04-02", "url": "https://youtube.com" }
]

const qualifyingResults = [
    { position: 1, driverRef: "hamilton", forename: "Lewis", surname: "Hamilton", constructorRef: "mercedes", constructorName: "Mercedes", q1: "1:23.456", q2: "1:22.345", q3: "1:21.234" },
    { position: 2, driverRef: "verstappen", forename: "Max", surname: "Verstappen", constructorRef: "redbull", constructorName: "Red Bull Racing", q1: "1:23.789", q2: "1:22.678", q3: "1:21.567" }
];

const top3Racers = [
    { position: 1, forename: "Lewis", surname: "Hamilton" },
    { position: 2, forename: "Max", surname: "Verstappen" },
    { position: 3, forename: "Bob", surname: "Doe" }
];

const finalResults = [
    { "position": 1, "forename": "Charles", "surname": "Leclerc", "constructor": "Ferrari", "laps": 57, "points": 26 },
    { "position": 2, "forename": "Carlos", "surname": "Sainz", "constructor": "Ferrari", "laps": 57, "points": 18 },
    { "position": 3, "forename": "Lewis", "surname": "Hamilton", "constructor": "Mercedes", "laps": 57, "points": 15 },
    { "position": 4, "forename": "George", "surname": "Russell", "constructor": "Mercedes", "laps": 57, "points": 12 },
    { "position": 5, "forename": "Kevin", "surname": "Magnussen", "constructor": "Haas F1 Team", "laps": 57, "points": 10 },
    { "position": 6, "forename": "Valtteri", "surname": "Bottas", "constructor": "Alfa Romeo", "laps": 57, "points": 8 },
    { "position": 7, "forename": "Esteban", "surname": "Ocon", "constructor": "Alpine F1 Team", "laps": 57, "points": 6 },
    { "position": 8, "forename": "Yuki", "surname": "Tsunoda", "constructor": "AlphaTauri", "laps": 57, "points": 4 },
    { "position": 9, "forename": "Fernando", "surname": "Alonso", "constructor": "Alpine F1 Team", "laps": 57, "points": 2 },
    { "position": 10, "forename": "Guanyu", "surname": "Zhou", "constructor": "Alfa Romeo", "laps": 57, "points": 1 }
];

const constructorResults = [
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 6, "points": 8 },
    { "name": "Ferrari", "nationality": "swiss", "url": "youtube.com", "round": 1, "circuit": "Bahrain Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 10, "points": 1 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Guanyu", "surname": "Zhou", "position": 11, "points": 0 },
    { "name": "Mercedes", "nationality": "swiss", "url": "youtube.com", "round": 2, "circuit": "Saudi Arabian Grand Prix", "forename": "Valtteri", "surname": "Bottas", "position": 0, "points": 0 }
];

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

// Function to create each race card
function createRaceCard(raceGrid, race) {
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
    meta.textContent = race.circuit;
    contentDiv.appendChild(meta);

    const extraContent = document.createElement("div");
    extraContent.className = "extra content";
    card.appendChild(extraContent);

    const resultsButton = document.createElement("a");
    resultsButton.className = "ui tiny button fluid";
    resultsButton.href = `#`; //replace with eventhandler
    resultsButton.textContent = "Results";
    extraContent.appendChild(resultsButton);

    resultsButton.addEventListener("click", () => {
        displayRaceDetails(race);
        displayQualifyResults(qualifyingResults);
        displayTop3Racers(top3Racers);
        displayFinalResults(finalResults);
    });
}

// Function to filter races by season and render race cards
function renderRaceList(raceGrid, seasonYear) {
    const seasonRaces = races.filter(race => race.year === seasonYear);
    seasonRaces.forEach(race => createRaceCard(raceGrid, race));
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

    segment.appendChild(createDetailParagraph("Race Name", race.raceName));
    segment.appendChild(createDetailParagraph("Round", race.round));
    segment.appendChild(createDetailParagraph("Circuit Name", race.circuit));
    segment.appendChild(createDetailParagraph("Location", race.location));
    segment.appendChild(createDetailParagraph("Country", race.country));
    segment.appendChild(createDetailParagraph("Date of Race", race.date));

    const infoLink = createInfoLink("Race Information", race.url);
    segment.appendChild(infoLink);
}
// Function to display the qualifying results for selected race
function displayQualifyResults(qualifyingResults) {
    const detailsColumn = document.querySelector(".eleven.wide.column");
    const segment = document.createElement("div");
    segment.className = "ui two column grid";

    const divTable = createTableContainer("Qualifying Results");

    // Create and append the table
    const table = createQualifyingResultsTable(qualifyingResults);
    divTable.appendChild(table);

    // Append to segment and details column
    segment.appendChild(divTable);
    detailsColumn.appendChild(segment);
}

function displayTop3Racers(top3Racers) {
    const detailsColumn = document.querySelector(".ui.two.column.grid");
    const segment = document.createElement("div");
    segment.classList = "column top3";
    const divTable = createTableContainer("Top 3 Racers");

    const table = createTop3RacersTable(top3Racers);
    divTable.appendChild(table);

    segment.appendChild(divTable);
    detailsColumn.appendChild(segment);
}

function displayFinalResults(finalResults) {
    const detailsColumn = document.querySelector(".column.top3");
    const divTable = createTableContainer("Race Results");
    const table = createFinalResultsTable(finalResults);
    divTable.append(table);
    detailsColumn.appendChild(divTable);
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
    const tbody = document.createElement("tbody");

    qualifyingResults.forEach(result => {
        const row = document.createElement("tr");

        row.appendChild(createCell(result.position));
        // row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, ""));
        row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, "", true, false));
        row.appendChild(createLinkCell(result.constructorName, "#", false, true, constructorResults));
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
        row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, "", true, false));

        tbody.appendChild(row)
    });

    return tbody
}


function createFinalResultsTableBody(finalResults) {
    const tbody = document.createElement("tbody");
    finalResults.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.position));
        row.appendChild(createLinkCell(`${result.forename} ${result.surname}`, "", true, false));
        // row.appendChild(createLinkCell(result.constructor, "", false, true));
        row.appendChild(createLinkCell(result.constructor, "#", false, true, constructorResults));

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


function createLinkCell(textContent, href, isDriver = false, isConstructor = false, details = null) {
    const cell = document.createElement("td");
    const link = document.createElement("a");
    link.className = "underline-link";
    link.href = href;
    link.textContent = textContent;

    // If it's a driver link, add a click event
    if (isDriver && details) {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior
            displayDriverPopup(details);
        });
    }

    // If it's a constructor link, add a click event
    if (isConstructor && details) {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default link behavior
            displayConstructorPopup(details);
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
export function renderRaces(seasonYear) {
    const browseView = document.querySelector("#browse");
    browseView.innerHTML = ""; // Clear existing browse view content
    const mainContainer = setupMainContainer();

    createNavigationBar(view => {
        const homeView = document.querySelector("#home");
        if (view === "home") {
            homeView.classList.remove("hidden");
            browseView.classList.add("hidden");
            switchStylesheet("home");
        } else {
            homeView.classList.add("hidden");
            browseView.classList.remove("hidden");
            switchStylesheet("browse");
        }
    });

    const mainGrid = createMainGrid(browseView);
    const raceGrid = createRaceListColumn(mainGrid, seasonYear);
    renderRaceList(raceGrid, seasonYear);
    createDetailsColumn(mainGrid, seasonYear);
}


function displayConstructorPopup(constructor) {
    const constructorPopup = document.querySelector("#constructor");
    constructorPopup.innerHTML = ""; // Clear previous content

    createConstructorDetails(constructor, constructorPopup);

    const closeButton = document.createElement("button");
    closeButton.className = "ui button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        constructorPopup.style.display = "none";
    });
    constructorPopup.appendChild(closeButton);

    constructorPopup.style.display = "block";
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
    segment.appendChild(createDetailParagraph("Name", "John Doe"));
    segment.appendChild(createDetailParagraph("Nationality", "Add Nationality"));
    const infoLink = createInfoLink("Constructor Biography", "Add URL");
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