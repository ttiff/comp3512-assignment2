import { createNavigationBar, switchStylesheet } from "./script.js";
import { fetchAndStoreData, updateStorage, removeStorage, retrieveStorage, fetchDriverDetails, fetchConstructorDetails } from './dataUtils.js';

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

// Function to create each race card
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
        displayRaceDetails(race, results);
        displayQualifyResults(race.id, qualifyingResults, results);
        displayTop3Racers(race.id, results);
        displayFinalResults(race.id, results);
    });
}


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

function displayRaceDetails(race, results) {
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
        displayCircuitPopup(race.circuit.id, race, race.year); // Your popup function
    });

    circuitParagraph.appendChild(circuitLabel);
    circuitParagraph.appendChild(circuitLink);

    segment.appendChild(circuitParagraph); // Add the paragraph to the segment

    segment.appendChild(createDetailParagraph("Location", race.circuit.location));
    segment.appendChild(createDetailParagraph("Country", race.circuit.country));
    segment.appendChild(createDetailParagraph("Date of Race", race.date));

    const infoLink = createInfoLink("Race Information", race.url);
    segment.appendChild(infoLink);
}


function displayQualifyResults(raceId, qualifyingResults, results) {
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

function displayTop3Racers(raceId, results) {
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

function displayFinalResults(raceId, results) {
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


function createTableContainer(titleText) {
    const divTable = document.createElement("div");
    divTable.className = "column";

    const title = document.createElement("h3");
    title.textContent = titleText;
    divTable.appendChild(title);

    return divTable;
}

function createQualifyingResultsTable(qualifyingResults, results) {
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver", "Constructor", "Q1", "Q2", "Q3"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createQualifyingTableBody(qualifyingResults, results);
    table.appendChild(tbody);

    return table;
}

function createTop3RacersTable(top3Racers, results) {
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createTop3RacersTableBody(top3Racers, results);
    table.appendChild(tbody);

    return table;

}

function createFinalResultsTable(finalResults, results) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver", "Constructor", "Laps", "Points"];
    const thead = createTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createFinalResultsTableBody(finalResults, results);
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


function createQualifyingTableBody(qualifyingResults, results) {
    const tbody = document.createElement("tbody");

    qualifyingResults.forEach(result => {
        const row = document.createElement("tr");

        row.appendChild(createCell(result.position));
        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, results, result.race.year));
        row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id, results, result.race.year));

        row.appendChild(createCell(result.q1));
        row.appendChild(createCell(result.q2));
        row.appendChild(createCell(result.q3));

        tbody.appendChild(row);
    });

    return tbody;
}

function createTop3RacersTableBody(top3Racers, results) {
    const tbody = document.createElement("tbody");
    top3Racers.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.position));
        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, results, result.race.year));

        tbody.appendChild(row)
    });

    return tbody
}


function createFinalResultsTableBody(finalResults, results) {
    const tbody = document.createElement("tbody");
    finalResults.forEach(result => {
        const row = document.createElement("tr");
        row.appendChild(createCell(result.position));
        row.appendChild(createLinkCell(`${result.driver.forename} ${result.driver.surname}`, "", true, false, result.driver.id, results, result.race.year));
        row.appendChild(createLinkCell(result.constructor.name, "#", false, true, result.constructor.id, results, result.race.year));

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
        row.appendChild(createCell(result.race.round));
        row.appendChild(createCell(result.race.name));
        row.appendChild(createCell(`${result.driver.forename} ${result.driver.surname}`));
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
        row.appendChild(createCell(result.race.round));
        row.appendChild(createCell(result.race.name));
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

function createLinkCell(
    textContent,
    href,
    isDriver = false,
    isConstructor = false,
    id,
    results,
    season
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
            displayDriverPopup(id, results, season);
        });
    }

    // Constructor link
    if (isConstructor) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            displayConstructorPopup(id, results, season);
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


async function displayConstructorPopup(id, constructors, season) {

    // Filter constructor data for the given id and season
    const filteredResults = constructors.filter(
        c => c.constructor.id === id && c.race.year === season
    );

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchConstructorDetails(id);

        if (filteredResults.length > 0) {
            const constructorPopup = document.querySelector("#constructor");
            constructorPopup.innerHTML = ""; // Clear previous content
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            // Create and display constructor details
            createConstructorDetails(filteredResults, constructorDetails, constructorPopup);

            // Add a close button (top-right)
            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                constructorPopup.style.display = "none";
                overlay.style.display = "none";
            });
            constructorPopup.appendChild(closeButtonTop);

            // Add a regular close button (bottom)
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
            console.warn(`No constructor found with ID ${id} for season ${season}`);
        }
    } catch (error) {
        console.error("Error fetching constructor details:", error);
    }
}




function createConstructorDetails(results, constructorDetails, targetElement) {
    const column = document.createElement("div");
    column.className = "twelve wide column"; // Add column class

    const segment = document.createElement("div");
    segment.className = "ui segment";

    const title = document.createElement("h2");
    title.textContent = "Constructor Details";
    segment.appendChild(title);

    //need to update this
    segment.appendChild(createDetailParagraph("Name", constructorDetails.name));
    segment.appendChild(createDetailParagraph("Nationality", constructorDetails.nationality));
    const infoLink = createInfoLink("Constructor Biography", constructorDetails.url);
    segment.appendChild(infoLink);


    column.appendChild(segment);

    targetElement.append(column);

    targetElement.append(createConstructorsTable(results))
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

async function displayDriverPopup(id, constructors, season) {

    // Filter constructor data for the given id and season
    const filteredResults = constructors.filter(
        c => c.driver.id === id && c.race.year === season
    );

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchDriverDetails(id);

        if (filteredResults.length > 0) {
            const driverPopup = document.querySelector("#driver");
            driverPopup.innerHTML = ""; // Clear previous content
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            // Create and display constructor details
            createDriverDetails(filteredResults, constructorDetails, driverPopup);

            // Add a close button (top-right)
            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                driverPopup.style.display = "none";
                overlay.style.display = "none";
            });
            driverPopup.appendChild(closeButtonTop);

            // Add a regular close button (bottom)
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
            console.warn(`No constructor found with ID ${id} for season ${season}`);
        }
    } catch (error) {
        console.error("Error fetching constructor details:", error);
    }
}


function createDriverDetails(driver, driverDetails, targetElement) {
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

    detailsContainer.appendChild(createDetailParagraph("Name", `${driverDetails.forename} ${driverDetails.surname}`));
    detailsContainer.appendChild(createDetailParagraph("Nationality", driverDetails.nationality));
    detailsContainer.appendChild(createDetailParagraph("Age", calculateAge(driverDetails.dob)));
    const infoLink = createInfoLink("Driver Biography", driverDetails.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);

    targetElement.appendChild(createDriversTable(driver || []));
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


function displayCircuitPopup(id, race, season) {
    console.log(race);

    const circuitPopup = document.querySelector("#circuit");
    circuitPopup.innerHTML = ""; // Clear previous content
    const overlay = document.querySelector("#modal-overlay");
    overlay.style.display = "block";

    // Create and display constructor details
    createCircuitDetails(race, circuitPopup);

    // Add a close button (top-right)
    const closeButtonTop = document.createElement("button");
    closeButtonTop.className = "close-button-top";
    closeButtonTop.textContent = "X";
    closeButtonTop.addEventListener("click", () => {
        circuitPopup.style.display = "none";
        overlay.style.display = "none";
    });
    circuitPopup.appendChild(closeButtonTop);

    // Add a regular close button (bottom)
    const closeButton = document.createElement("button");
    closeButton.className = "ui button circuit-close-button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        circuitPopup.style.display = "none";
        overlay.style.display = "none";
    });
    circuitPopup.appendChild(closeButton);

    circuitPopup.style.display = "block";

}
function createCircuitDetails(driver, targetElement) {
    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = '../img/profile.png';
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Circuit Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", driver.circuit.name));
    detailsContainer.appendChild(createDetailParagraph("Location", driver.circuit.location));
    detailsContainer.appendChild(createDetailParagraph("Country", driver.circuit.country));
    const infoLink = createInfoLink("Circuit Biography", driver.circuit.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);

}