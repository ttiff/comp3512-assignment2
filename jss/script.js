document.addEventListener("DOMContentLoaded", () => {
    const homeView = document.querySelector("#home");

    // Replace with API data when available
    const seasons = ["2020", "2021", "2022", "2023"];


    // Create and append the h1 element to the home view
    const header = document.createElement("h1");
    header.textContent = "COMP 3512 - F1 Dashboard Project";
    homeView.appendChild(header);

    // Create and append the p element to the home view
    const pageInfo = document.createElement("p");
    pageInfo.textContent = "Explore race results, driver performances, and more from the 2022 F1 season.";
    homeView.appendChild(pageInfo);

    // Create and append the select element to the home view
    const seasonSelect = document.createElement("select");
    homeView.appendChild(seasonSelect);

    // Function to populate the select element with options
    function populateSeasonOptions(seasons) {
        seasons.forEach(season => {
            const option = document.createElement("option");
            option.value = season;
            option.textContent = `${season} Season`;
            seasonSelect.appendChild(option);
        });
    }

    // Populate the select dropdown with season options
    populateSeasonOptions(seasons);
});
