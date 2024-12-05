import { fetchAndStoreData, updateStorage, removeStorage, retrieveStorage, fetchDriverDetails, fetchConstructorDetails, isFavorite, toggleFavorite, getFavorites } from './dataUtils.js';
// import { displayDriverPopup, displayConstructorPopup } from './browseView.js';
import { displayConstructorPopup, displayDriverPopup, displayCircuitPopup } from './popupUtils.js';



export function createTableHeaders(headers, sortMapping, data, renderCallback) {
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

export function createPopUpTableHeaders(headers) {
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


export function createQualifyingResultsTable(qualifyingResults, results) {
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

export function createTop3RacersTable(top3Racers, results) {
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


export function createFinalResultsTable(finalResults, results) {
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


export function createQualifyingTableBody(qualifyingResults, results) {
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

export function createTop3RacersTableBody(top3Racers, results) {
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

export function createFinalResultsTableBody(finalResults, results) {
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


export function createConstructorTableBody(results) {
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

export function createDriversTableBody(results) {
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

export function createDriversTable(driverResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Round", "Circuit", "Position", "Points"];
    const thead = createPopUpTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createDriversTableBody(driverResults);
    table.appendChild(tbody);

    return table;
}


export function createCell(textContent) {
    const cell = document.createElement("td");
    cell.textContent = textContent;
    return cell;
}


export function createConstructorsTable(constructorResults) {

    const table = document.createElement("table");
    table.className = "ui celled striped single line very compact left aligned table";

    const headers = ["Round", "Circuit", "Driver", "Position", "Points"];
    const thead = createPopUpTableHeaders(headers);
    table.appendChild(thead);

    const tbody = createConstructorTableBody(constructorResults);
    table.appendChild(tbody);

    return table;
}