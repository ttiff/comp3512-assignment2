

/**
    This module generates the layout and components for the Home view of the Single Page Application (SPA).
 */

// Creates and returns a header element for the homepage
function addHeader() {
    const header = document.createElement("h1");
    header.textContent = "Formula 1 Dashboard";
    return header;
}

// Creates and returns a description paragraph for the homepage
function addPageInfo() {
    const pageInfo = document.createElement("p");
    pageInfo.textContent =
        "MRU COMP 3512 Assignment #2 by Tiffany Tran. Built using HTML, CSS, JavaScript, and Semantic UI. Use the dropdown below to explore race results, driver performances, and more from the 2020–2023 F1 seasons.";
    return pageInfo;
}

// Creates the season selection dropdown
function createSeasonSelect(seasons, switchView, renderRaces) {
    const container = document.createElement("div");
    container.classList.add("select-container");
    const seasonSelect = document.createElement("select");

    // Populate the dropdown with season options
    populateSeasonOptions(seasonSelect, seasons);
    container.appendChild(seasonSelect);

    // Handle season selection change
    seasonSelect.addEventListener("change", (event) => {
        const selectedSeason = event.target.value;
        if (selectedSeason) {
            switchView("browse");
            renderRaces(selectedSeason);
        }
    });

    return container;
}

// Populates the dropdown with options for each available season
function populateSeasonOptions(selectElement, seasons) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a Season";
    selectElement.appendChild(defaultOption);

    seasons.forEach((season) => {
        const option = document.createElement("option");
        option.value = season;
        option.textContent = `${season} Season`;
        selectElement.appendChild(option);
    });
}

// Creates the diagonal layout for the Home view
export function addDiagonalLayout(seasons, switchView, renderRaces) {
    const diagonalLayout = document.createElement("section");
    diagonalLayout.classList.add("diagonal-layout");

    const imageSection = document.createElement("div");
    imageSection.classList.add("image-section");

    const textSection = document.createElement("div");
    textSection.classList.add("text-section");

    textSection.appendChild(addHeader());
    textSection.appendChild(addPageInfo());
    textSection.appendChild(createSeasonSelect(seasons, switchView, renderRaces));

    diagonalLayout.appendChild(imageSection);
    diagonalLayout.appendChild(textSection);

    return diagonalLayout;
}
