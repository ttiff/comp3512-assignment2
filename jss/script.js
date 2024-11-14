document.addEventListener("DOMContentLoaded", () => {
    const homeView = document.querySelector("#home");

    // Replace with API data when available
    const seasons = ["2020", "2021", "2022", "2023"];

    // Method to create and append the header
    function addHeader() {
        const header = document.createElement("h1");
        header.textContent = "COMP 3512 - F1 Dashboard Project";
        homeView.appendChild(header);
    }

    // Method to create and append the description paragraph
    function addPageInfo() {
        const pageInfo = document.createElement("p");
        pageInfo.textContent = "Explore race results, driver performances, and more from the 2022 F1 season.";
        homeView.appendChild(pageInfo);
    }

    // Method to create and append the select element
    function createSeasonSelect() {
        const seasonSelect = document.createElement("select");
        homeView.appendChild(seasonSelect);
        populateSeasonOptions(seasonSelect, seasons);
    }

    // Method to populate the select element with options
    function populateSeasonOptions(selectElement, seasons) {
        seasons.forEach(season => {
            const option = document.createElement("option");
            option.value = season;
            option.textContent = `${season} Season`;
            selectElement.appendChild(option);
        });
    }

    // Call methods to build the home view
    addHeader();
    addPageInfo();
    createSeasonSelect();
});
