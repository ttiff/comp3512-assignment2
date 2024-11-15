import { renderRaces } from "./browseView.js";

document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.querySelector("main");
    mainContainer.classList.add("container");
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");
    browseView.classList.add("hidden");
    homeView.classList.remove("hidden");


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

        // Populate select options
        populateSeasonOptions(seasonSelect, seasons);
        container.appendChild(seasonSelect);

        // Add event listener to seasonSelect
        seasonSelect.addEventListener("change", (event) => {
            const selectedSeason = event.target.value;
            if (selectedSeason) {
                homeView.classList.add("hidden"); // Hide home view
                browseView.classList.remove("hidden"); // Show browse view
                switchStylesheet("browse");
                renderRaces(selectedSeason);
            }
        });

        return container;
    }

    // Method to populate the select element with options
    function populateSeasonOptions(selectElement, seasons) {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select a Season";
        selectElement.appendChild(defaultOption);

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

        textSection.appendChild(addHeader());
        textSection.appendChild(addPageInfo());
        textSection.appendChild(createSeasonSelect());

        // Append the two divs to the diagonal-layout section
        diagonalLayout.appendChild(imageSection);
        diagonalLayout.appendChild(textSection);

        // Append the diagonal-layout section to the #home element
        homeView.appendChild(diagonalLayout);
    }

    // Call method to build the home view
    addDiagonalLayout();
});

export function switchStylesheet(view) {
    const themeStylesheet = document.querySelector("#theme-stylesheet");

    if (!themeStylesheet) {
        console.error("Stylesheet element with ID 'theme-stylesheet' not found.");
        return;
    }

    if (view === "home") {
        themeStylesheet.href = "css/style_index.css";
    } else if (view === "browse") {
        themeStylesheet.href = "css/style_browse.css";
    }
}
