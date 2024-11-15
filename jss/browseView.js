import { switchStylesheet } from "./script.js";

// Sample data for races; replace with API data when available
const races = [
    { "raceName": "Bahrain Grand Prix", "year": "2020", "round": 1, "circuit": "Bahrain International Circuit", "raceId": 1 },
    { "raceName": "Saudi Arabian Grand Prix", "year": "2020", "round": 2, "circuit": "Jeddah Corniche Circuit", "raceId": 2 },
    { "raceName": "Australian Grand Prix", "year": "2020", "round": 3, "circuit": "Melbourne Grand Prix Circuit", "raceId": 3 },
    { "raceName": "Emilia Romagna Grand Prix", "year": "2021", "round": 4, "circuit": "Imola Circuit", "raceId": 4 },
    { "raceName": "Miami Grand Prix", "year": "2021", "round": 5, "circuit": "Miami International Autodrome", "raceId": 5 },
    { "raceName": "Spanish Grand Prix", "year": "2021", "round": 6, "circuit": "Circuit de Barcelona-Catalunya", "raceId": 6 },
    { "raceName": "Monaco Grand Prix", "year": "2022", "round": 7, "circuit": "Circuit de Monaco", "raceId": 7 },
    { "raceName": "Azerbaijan Grand Prix", "year": "2022", "round": 8, "circuit": "Baku City Circuit", "raceId": 8 },
    { "raceName": "Canadian Grand Prix", "year": "2022", "round": 9, "circuit": "Circuit Gilles Villeneuve", "raceId": 9 },
    { "raceName": "British Grand Prix", "year": "2023", "round": 10, "circuit": "Silverstone Circuit", "raceId": 10 },
    { "raceName": "Austrian Grand Prix", "year": "2023", "round": 11, "circuit": "Red Bull Ring", "raceId": 11 },
    { "raceName": "French Grand Prix", "year": "2023", "round": 12, "circuit": "Circuit Paul Ricard", "raceId": 12 },
    { "raceName": "Hungarian Grand Prix", "year": "2023", "round": 13, "circuit": "Hungaroring", "raceId": 13 }
];


// Function to set up the main container
function setupMainContainer() {
    const mainContainer = document.querySelector("main");
    mainContainer.className = "ui fluid container";
    return mainContainer;
}

// Function to create the main navigation menu container
function createMenuContainer() {
    const headerDiv = document.createElement("div");
    headerDiv.className = "ui dark large secondary pointing menu";
    return headerDiv;
}

// Function to create a menu item with an icon
function createMenuItem(href, iconClass, onClick = null) {
    const link = document.createElement("a");
    link.className = "item";
    link.href = href;
    if (onClick) {
        link.addEventListener("click", onClick);
    }
    const icon = document.createElement("i");
    icon.className = iconClass;
    link.appendChild(icon);
    return link;
}

// Main function to assemble navigation bar
function createNavigation() {
    const headerContainer = document.querySelector("header");
    const menuContainer = createMenuContainer();
    headerContainer.appendChild(menuContainer);

    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");

    // Home button event handler
    const homeLink = createMenuItem("#", "fas fa-home", () => {
        headerContainer.innerHTML = "";
        homeView.classList.remove("hidden"); // Show home view
        browseView.classList.add("hidden");   // Hide browse view

        // Switch stylesheet to home view styling
        switchStylesheet("home");
    });
    menuContainer.appendChild(homeLink);

    const githubLink = createMenuItem("https://github.com/ttiff/comp3512-assignment2", "fab fa-github");
    menuContainer.appendChild(githubLink);
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

// Main function to render the races and details message
export function renderRaces(seasonYear) {
    // Clear existing navigation and content to avoid duplication
    const headerContainer = document.querySelector("header");
    headerContainer.innerHTML = ""; // Clear the navigation container

    const mainContainer = setupMainContainer();
    const browseView = document.querySelector("#browse");
    browseView.innerHTML = ""; // Clear existing browse view content

    createNavigation();

    const mainGrid = createMainGrid(browseView);
    const raceGrid = createRaceListColumn(mainGrid, seasonYear);
    renderRaceList(raceGrid, seasonYear);
    createDetailsColumn(mainGrid, seasonYear);
}
