document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.querySelector("main");
    mainContainer.classList.add("container"); // Adds id "container" to the main element
    const homeView = document.querySelector("#home");

    // Replace with API data when available
    const seasons = ["2020", "2021", "2022", "2023"];

    // Method to create and append the header
    function addHeader() {
        const header = document.createElement("h1");
        header.textContent = "Formula 1 Dashboard";
        return header;
    }

    // Method to create and append the description paragraph
    function addPageInfo() {
        const pageInfo = document.createElement("p");
        pageInfo.textContent = "MRU COMP 3512 Assignment #2 by Tiffany Tran. Built using HTML, CSS, JavaScript and Semantic UI. Click below to explore race results, driver performances, and more from 2020 - 2022 F1 seasons.";
        return pageInfo;
    }

    // Method to create and append the select element
    function createSeasonSelect() {
        const container = document.createElement("div");
        container.classList.add("select-container");
        const seasonSelect = document.createElement("select");

        populateSeasonOptions(seasonSelect, seasons);
        container.appendChild(seasonSelect);
        return container;
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

    // Method to create and append the diagonal-layout section
    function addDiagonalLayout() {
        const diagonalLayout = document.createElement("section");
        diagonalLayout.classList.add("diagonal-layout");

        const imageSection = document.createElement("div");
        imageSection.classList.add("image-section");

        const textSection = document.createElement("div");
        textSection.classList.add("text-section");

        textSection.appendChild(addHeader())
        textSection.appendChild(addPageInfo())
        textSection.appendChild(createSeasonSelect());

        // Append the two divs to the diagonal-layout section
        diagonalLayout.appendChild(imageSection);
        diagonalLayout.appendChild(textSection);

        // Append the diagonal-layout section to the #home element
        homeView.appendChild(diagonalLayout);
    }

    // Call methods to build the home view
    addHeader();
    addPageInfo();
    createSeasonSelect();
    addDiagonalLayout();
});
