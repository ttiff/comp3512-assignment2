/** 
    This module provides utility functions for creating and manipulating the DOM elements used in the SPA 
*/

// Sets up the main container element for the application layout.
export function setupMainContainer() {
    const mainContainer = document.querySelector("main");
    mainContainer.className = "ui fluid container";
    return mainContainer;
}

// Creates and appends a main grid layout to a parent element.
export function createMainGrid(parent) {
    const mainGrid = document.createElement("div");
    mainGrid.className = "ui grid stackable";
    parent.appendChild(mainGrid);
    return mainGrid;
}

// Creates a container for a table 
export function createTableContainer(titleText) {
    const divTable = document.createElement("div");
    divTable.className = "column";

    const title = document.createElement("h3");
    title.textContent = titleText;
    divTable.appendChild(title);

    return divTable;
}

//  Creates and appends the left column for displaying a list of races for a given season
export function createRaceListColumn(parent, seasonYear) {
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

// Creates and appends the right column for the details message
export function createDetailsColumn(parent, seasonYear) {
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

// Creates favorites section for the favorites pop up card
export function addFavoritesSection(container, title, items, lookup) {
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
