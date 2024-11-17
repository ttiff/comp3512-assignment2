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

    resultsButton.addEventListener("click", () => displayRaceDetails(race));
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