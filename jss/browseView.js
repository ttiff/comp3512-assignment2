import { fetchAndStoreData, updateStorage, removeStorage, retrieveStorage, fetchDriverDetails, fetchConstructorDetails, isFavorite, toggleFavorite, getFavorites } from './dataUtils.js';

export let races = null;
export let qualifyingResults = null;
export let results = null;


function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

function sortData(data, key, order = "asc") {
    return data.sort((a, b) => {
        const valA = getNestedProperty(a, key);
        const valB = getNestedProperty(b, key);

        // Handle strings (case-insensitive)
        const valueA = typeof valA === "string" ? valA.toLowerCase() : valA;
        const valueB = typeof valB === "string" ? valB.toLowerCase() : valB;

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return 0;
    });
}


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

    const raceName = document.createElement("span");
    raceName.textContent = race.name;
    meta.appendChild(raceName);

    if (isFavorite("circuits", race.id)) {
        const raceHeartIcon = document.createElement("i");
        raceHeartIcon.className = "heart icon red heart-icon";
        meta.appendChild(raceHeartIcon);
    }

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
        console.log(race.id)
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
        displayCircuitPopup(race.circuit.id, race, race.year);
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
    const sortMapping = {
        "Position": "position",
        "Driver": "driver.surname",
        "Constructor": "constructor.name",
        "Q1": "q1",
        "Q2": "q2",
        "Q3": "q3",
    };

    const thead = createTableHeaders(headers, sortMapping, qualifyingResults, (sortedData) => {
        const newTbody = createQualifyingTableBody(sortedData, results);
        table.replaceChild(newTbody, table.querySelector("tbody"));
    });

    table.appendChild(thead);

    const tbody = createQualifyingTableBody(qualifyingResults, results);
    table.appendChild(tbody);

    return table;
}

function createTop3RacersTable(top3Racers, results) {
    console.log(top3Racers);
    console.log(results);
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver"];
    const sortMapping = {
        "Position": "position",
        "Driver": "driver.surname",
    };

    // Create headers with sorting functionality
    const thead = createTableHeaders(headers, sortMapping, top3Racers, (sortedData) => {
        const newTbody = createTop3RacersTableBody(sortedData, results);
        table.replaceChild(newTbody, table.querySelector("tbody"));
    });

    table.appendChild(thead);

    const tbody = createTop3RacersTableBody(top3Racers, results);
    table.appendChild(tbody);

    return table;
}

function createFinalResultsTable(finalResults, results) {
    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Position", "Driver", "Constructor", "Laps", "Points"];
    const sortMapping = {
        "Position": "position",
        "Driver": "driver.surname",
        "Constructor": "constructor.name",
        "Laps": "laps",
        "Points": "points",
    };

    const thead = createTableHeaders(headers, sortMapping, finalResults, (sortedData) => {
        const newTbody = createFinalResultsTableBody(sortedData, results);
        table.replaceChild(newTbody, table.querySelector("tbody"));
    });

    table.appendChild(thead);

    const tbody = createFinalResultsTableBody(finalResults, results);
    table.appendChild(tbody);

    return table;
}


function createPopUpTableHeaders(headers) {
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

function createTableHeaders(headers, sortMapping, data, renderCallback) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach((headerText) => {
        const th = document.createElement("th");
        th.textContent = headerText;

        if (sortMapping[headerText]) {
            th.classList.add("sortable");
            th.dataset.sortKey = sortMapping[headerText];
            th.dataset.sortOrder = "asc"; // Default sort order

            th.addEventListener("click", () => {
                const sortKey = th.dataset.sortKey;
                const order = th.dataset.sortOrder;

                // Toggle sort order
                th.dataset.sortOrder = order === "asc" ? "desc" : "asc";

                // Remove active class from all headers
                const allHeaders = th.parentNode.querySelectorAll(".sortable");
                allHeaders.forEach(header => {
                    header.classList.remove("active", "asc", "desc");
                });

                // Add active class to the clicked header
                th.classList.add("active");
                th.classList.add(order); // Add 'asc' or 'desc' class

                // Sort data and re-render the table
                const sortedData = sortData([...data], sortKey, order);
                renderCallback(sortedData);
            });
        }

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
}


function createQualifyingTableBody(qualifyingResults, results) {
    const tbody = document.createElement("tbody");

    qualifyingResults.forEach(result => {
        const row = document.createElement("tr");

        const positionCell = document.createElement("td");
        const positionText = document.createTextNode(result.position);
        positionCell.appendChild(positionText);

        if (result.position <= 10) {
            const qualifiedIcon = document.createElement("i");
            qualifiedIcon.className = "qualified-icon fas fa-check-circle";
            positionCell.appendChild(qualifiedIcon);
        }

        row.appendChild(positionCell);

        // Create Driver Cell
        const driverCell = document.createElement("td");
        const driverLink = document.createElement("a");
        driverLink.href = "#";
        driverLink.textContent = `${result.driver.forename} ${result.driver.surname}`;
        driverLink.addEventListener("click", (e) => {
            e.preventDefault();
            displayDriverPopup(result.driver.id, results, result.race.year, result.race.id);
        });

        driverCell.appendChild(driverLink);

        if (isFavorite("drivers", result.driver.id)) {
            const driverHeartIcon = document.createElement("i");
            driverHeartIcon.className = "heart icon red heart-icon";
            driverCell.appendChild(driverHeartIcon);
        }

        row.appendChild(driverCell);

        // Create Constructor Cell
        const constructorCell = document.createElement("td");
        const constructorLink = document.createElement("a");
        constructorLink.href = "#";
        constructorLink.textContent = result.constructor.name;
        constructorLink.addEventListener("click", (e) => {
            e.preventDefault();
            displayConstructorPopup(result.constructor.id, results, result.race.year, result.race.id);
        });

        constructorCell.appendChild(constructorLink);

        if (isFavorite("constructors", result.constructor.id)) {
            const constructorHeartIcon = document.createElement("i");
            constructorHeartIcon.className = "heart icon red heart-icon";
            constructorCell.appendChild(constructorHeartIcon);
        }

        row.appendChild(constructorCell);

        // Add Q1, Q2, and Q3 cells
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

        const positionCell = document.createElement("td");

        const medalIcon = document.createElement("i");
        medalIcon.className = "medal-icon";
        switch (result.position) {
            case 1:
                medalIcon.classList.add("fas", "fa-trophy", "gold-medal");
                break;
            case 2:
                medalIcon.classList.add("fas", "fa-trophy", "silver-medal");
                break;
            case 3:
                medalIcon.classList.add("fas", "fa-trophy", "bronze-medal");
                break;
            default:
                break;
        }

        positionCell.appendChild(medalIcon);

        // Add Position Number
        const positionText = document.createTextNode(` ${result.position}`);
        positionCell.appendChild(positionText);

        row.appendChild(positionCell);

        const driverCell = document.createElement("td");
        const driverLink = document.createElement("a");
        driverLink.href = "#";
        driverLink.textContent = `${result.driver.forename} ${result.driver.surname}`;
        driverLink.addEventListener("click", (e) => {
            e.preventDefault();
            displayDriverPopup(result.driver.id, results, result.race.year, result.race.id);
        });
        driverCell.appendChild(driverLink);

        if (isFavorite("drivers", result.driver.id)) {
            const driverHeartIcon = document.createElement("i");
            driverHeartIcon.className = "heart icon red heart-icon";
            driverCell.appendChild(driverHeartIcon);
        }

        row.appendChild(driverCell);

        tbody.appendChild(row);
    });

    return tbody;
}

function createFinalResultsTableBody(finalResults, results) {
    const tbody = document.createElement("tbody");

    finalResults.forEach(result => {
        const row = document.createElement("tr");

        row.appendChild(createCell(result.position));

        const driverCell = document.createElement("td");
        const driverLink = document.createElement("a");
        driverLink.href = "#";
        driverLink.textContent = `${result.driver.forename} ${result.driver.surname}`;
        driverLink.addEventListener("click", (e) => {
            e.preventDefault();
            displayDriverPopup(result.driver.id, results, result.race.year, result.race.id);
        });
        driverCell.appendChild(driverLink);


        if (isFavorite("drivers", result.driver.id)) {
            const driverHeartIcon = document.createElement("i");
            driverHeartIcon.className = "heart icon red heart-icon";
            driverCell.appendChild(driverHeartIcon);
        }

        row.appendChild(driverCell);

        const constructorCell = document.createElement("td");
        const constructorLink = document.createElement("a");
        constructorLink.href = "#";
        constructorLink.textContent = result.constructor.name;
        constructorLink.addEventListener("click", (e) => {
            e.preventDefault();
            displayConstructorPopup(result.constructor.id, results, result.race.year, result.race.id);
        });
        constructorCell.appendChild(constructorLink);

        if (isFavorite("constructors", result.constructor.id)) {
            const driverHeartIcon = document.createElement("i");
            driverHeartIcon.className = "heart icon red heart-icon"; // Add heart-icon class
            constructorCell.appendChild(driverHeartIcon);
        }

        row.appendChild(constructorCell);

        row.appendChild(createCell(result.laps));
        row.appendChild(createCell(result.points));

        tbody.appendChild(row);
    });

    return tbody;
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


async function displayConstructorPopup(id, constructors, season, raceid) {

    // Filter constructor data for the given id and season
    let filteredResults = constructors.filter(
        c => c.constructor.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchConstructorDetails(id);

        if (filteredResults.length > 0) {
            const constructorPopup = document.querySelector("#constructor");
            constructorPopup.innerHTML = ""; // Clear previous content
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            createConstructorDetails(filteredResults, constructorDetails, constructorPopup, raceid);

            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                constructorPopup.style.display = "none";
                overlay.style.display = "none";
            });
            constructorPopup.appendChild(closeButtonTop);
            const closeButton = document.createElement("button");
            closeButton.className = "ui button close-button";
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


function createConstructorDetails(constructor, constructorDetails, targetElement, raceId) {
    console.log("Constructor Details:", constructorDetails);
    console.log("Race ID:", raceId);

    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const favoriteIcon = document.createElement("i");
    const constructorId = constructorDetails.constructorId;

    favoriteIcon.className = isFavorite("constructors", constructorId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        console.log("Toggling favorite for constructor ID:", constructorId);
        toggleFavorite("constructors", constructorId);

        // Update only the favorite icon state
        const isNowFavorite = isFavorite("constructors", constructorId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Update the race details without re-rendering the entire tables
        updateRaceTables(raceId);
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Constructor Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", constructorDetails.name));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Nationality: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${constructorDetails.nationality}`;

    // Get the country code and flag URL
    const countryCode = getCountryCodeByNationality(constructorDetails.nationality);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${constructorDetails.nationality} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);

    const infoLink = createInfoLink("Constructor Biography", constructorDetails.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);
    column.appendChild(segment);

    targetElement.appendChild(column);
    targetElement.append(createConstructorsTable(constructor));
}

function createConstructorsTable(constructorResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Round", "Circuit", "Driver", "Position", "Points"];
    const thead = createPopUpTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createConstructorTableBody(constructorResults);
    table.appendChild(tbody);

    return table;
}

async function displayDriverPopup(id, constructors, season, raceid) {

    // Filter constructor data for the given id and season
    let filteredResults = constructors.filter(
        c => c.driver.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchDriverDetails(id);

        if (filteredResults.length > 0) {
            const driverPopup = document.querySelector("#driver");
            driverPopup.innerHTML = ""; // Clear previous content
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            // Create and display constructor details
            createDriverDetails(filteredResults, constructorDetails, driverPopup, raceid);

            // Add a close button (top-right)
            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                driverPopup.style.display = "none";
                overlay.style.display = "none";
            });
            driverPopup.appendChild(closeButtonTop);

            const closeButton = document.createElement("button");
            closeButton.className = "ui button close-button";
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

function createDriverDetails(driver, driverDetails, targetElement, raceId) {
    console.log("Driver Details:", driverDetails);
    console.log("Race ID:", raceId);

    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = `https://placehold.co/300x200?text=${driverDetails.forename || "Driver"}+${driverDetails.surname || "Image"}`;
    image.alt = `${driver.forename || "Driver"} ${driver.surname || "Image"}`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const favoriteIcon = document.createElement("i");
    const driverId = driverDetails.driverId;

    favoriteIcon.className = isFavorite("drivers", driverId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        console.log("Toggling favorite for driver ID:", driverId);
        toggleFavorite("drivers", driverId);

        // Update only the favorite icon state
        const isNowFavorite = isFavorite("drivers", driverId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Update the race details without re-rendering the entire tables
        updateRaceTables(raceId);
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Driver Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", `${driverDetails.forename} ${driverDetails.surname}`));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Nationality: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${driverDetails.nationality}`;

    // Get the country code and flag URL
    const countryCode = getCountryCodeByNationality(driverDetails.nationality);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode); // Helper function to generate the flag URL
    flagImg.alt = `${driverDetails.nationality} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);


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
    const thead = createPopUpTableHeaders(headers);
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

    const closeButton = document.createElement("button");
    closeButton.className = "ui button close-button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        circuitPopup.style.display = "none";
        overlay.style.display = "none";
    });
    circuitPopup.appendChild(closeButton);

    circuitPopup.style.display = "block";

}

function createCircuitDetails(driver, targetElement) {
    console.log("Circuit Details:", driver);
    console.log("Circuit ID:", driver.id);

    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";


    const favoriteIcon = document.createElement("i");
    const circuitId = driver.id;
    console.log("Constructor ID:", circuitId);

    favoriteIcon.className = isFavorite("constructors", circuitId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        console.log("Toggling favorite for race ID:", circuitId);
        toggleFavorite("circuits", circuitId);

        // Immediately update the icon
        const isNowFavorite = isFavorite("circuits", circuitId);
        console.log("Is now favorite:", isNowFavorite);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Re-render only the race list (left column)
        const raceGrid = document.querySelector("#race-grid");
        raceGrid.innerHTML = ""; // Clear race grid
        renderRaceList(raceGrid, races, qualifyingResults, results); // Re-render races

        // Re-display the current race details
        displayRaceDetails(driver, results); // Replace `driver` with the specific race object
        displayQualifyResults(driver.id, qualifyingResults, results);
        displayTop3Racers(driver.id, results);
        displayFinalResults(driver.id, results);
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    // image.src = '../img/profile.png';
    // image.src = `https://placehold.co/text=${driver.circuit.name || "Circuit"}`;
    image.src = `https://placehold.co/300x200?text=${driver.circuit.name || "Circuit"}`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Circuit Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", driver.circuit.name));
    detailsContainer.appendChild(createDetailParagraph("Location", driver.circuit.location));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Country: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${driver.circuit.country}`;

    const countryCode = getCountryCodeByCountry(driver.circuit.country);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode); // Helper function to generate the flag URL
    flagImg.alt = `${driver.circuit.country} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);


    const infoLink = createInfoLink("Circuit Biography", driver.circuit.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);
}

function updateRaceTables(raceId) {
    displayRaceDetails(races.find(r => r.id === raceId), results);
    displayQualifyResults(raceId, qualifyingResults, results);
    displayTop3Racers(raceId, results);
    displayFinalResults(raceId, results);
}

function getFlagUrl(countryCode) {
    return `https://flagcdn.com/w40/${countryCode}.png`;
}

function getCountryCodeByCountry(country) {
    const countryCodes = {
        'Bahrain': 'bh',
        'Saudi Arabia': 'sa',
        'Australia': 'au',
        'Italy': 'it',
        'USA': 'us',
        'Spain': 'es',
        'Monaco': 'mc',
        'Azerbaijan': 'az',
        'Canada': 'ca',
        'UK': 'gb',
        'Austria': 'at',
        'France': 'fr',
        'Hungary': 'hu',
        'Belgium': 'be',
        'Netherlands': 'nl',
        'Singapore': 'sg',
        'Japan': 'jp',
        'Mexico': 'mx',
        'Brazil': 'br',
        'UAE': 'ae',
        'Germany': 'de',
        'Switzerland': 'ch',
        'Thailand': 'th',
        'China': 'cn',
        'Denmark': 'dk',
        'Finland': 'fi',
        'Japan': 'jp',
        'South Africa': 'za',
        'India': 'in'
    };

    const defaultFlag = 'un';

    return countryCodes[country] || defaultFlag;
}


function getCountryCodeByNationality(nationality) {
    const nationalityCodes = {
        'Monegasque': 'mc',
        'Spanish': 'es',
        'British': 'gb',
        'Danish': 'dk',
        'Finnish': 'fi',
        'French': 'fr',
        'Japanese': 'jp',
        'Chinese': 'cn',
        'German': 'de',
        'Canadian': 'ca',
        'Thai': 'th',
        'Australian': 'au',
        'Mexican': 'mx',
        'Dutch': 'nl',
        'Swiss': 'ch',
        'Italian': 'it',
        'American': 'us',
        'Austrian': 'at'
    };

    const defaultFlag = 'un';

    return nationalityCodes[nationality] || defaultFlag;
}


function createLookup(results) {
    const lookups = {
        circuits: {},
        drivers: {},
        constructors: {},
    };

    results.forEach(result => {
        if (result.race && result.race.id && result.race.name) {
            lookups.circuits[result.race.id] = result.race.name;
        }

        if (result.driver && result.driver.id && result.driver.forename && result.driver.surname) {
            lookups.drivers[result.driver.id] = `${result.driver.forename} ${result.driver.surname}`;
        }

        if (result.constructor && result.constructor.id && result.constructor.name) {
            lookups.constructors[result.constructor.id] = result.constructor.name;
        }
    });

    return lookups;
}

function addFavoritesSection(container, title, items, lookup) {
    const sectionHeader = document.createElement("h3");
    sectionHeader.textContent = title;
    container.appendChild(sectionHeader);

    const list = document.createElement("ul");
    if (items.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = `No ${title.toLowerCase()} favorited.`;
        container.appendChild(emptyMessage);
    } else {
        items.forEach(id => {
            const listItem = document.createElement("li");
            listItem.textContent = lookup[id] || `ID: ${id} (unknown name)`;
            list.appendChild(listItem);
        });
        container.appendChild(list);
    }
}


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

    if (!results || results.length === 0) {
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
