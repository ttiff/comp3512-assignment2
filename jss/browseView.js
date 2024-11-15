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



// Function to render the races and the details message
export function renderRaces(seasonYear) {
    // Select or create the main container
    const mainContainer = document.querySelector("main")
    mainContainer.className = "ui fluid container";

    const browseView = document.querySelector("#browse");
    browseView.innerHTML = ""; // Clear existing content


    // Create the main grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "ui grid stackable";
    browseView.appendChild(mainGrid);

    // Left column for race list
    const raceListColumn = document.createElement("div");
    raceListColumn.className = "four wide column";
    mainGrid.appendChild(raceListColumn);

    // Header for the race list
    const header = document.createElement("h1");
    header.className = "ui centered header";
    header.textContent = `${seasonYear} Races`;
    raceListColumn.appendChild(header);

    // Create grid for race cards
    const raceGrid = document.createElement("div");
    raceGrid.className = "ui stackable doubling three column grid";
    raceGrid.id = "race-grid";
    raceListColumn.appendChild(raceGrid);

    // Filter races by season and create cards
    const seasonRaces = races.filter(race => race.year === seasonYear);
    seasonRaces.forEach(race => {
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
        resultsButton.href = "";
        resultsButton.textContent = "Results";
        extraContent.appendChild(resultsButton);
    });

    //message display on right
    const detailsColumn = document.createElement("div");
    detailsColumn.className = "eleven wide column";
    mainGrid.appendChild(detailsColumn);

    const segment = document.createElement("div");
    segment.className = "ui segment";
    detailsColumn.appendChild(segment);

    const message = document.createElement("p");
    message.textContent = "Please select a circuit to view details and race results for the 2022 season.";
    segment.appendChild(message);
}

// Initial call to render the races for the selected season
renderRaces("2022");
