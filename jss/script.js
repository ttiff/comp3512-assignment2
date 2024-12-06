import { renderRaces, displayFavoritesPopup } from "./browseView.js";
/**
    This module initializes and manages the core functionality and navigation for the SPA. It creates the homepage layout, handles 
    view switching between "home" and "browse" pages, and manages the header navigation.
 */

// Creates the navigation bar with links to "Home", "GitHub", and "Favorites"
export function createNavigationBar(switchViewCallback) {
    const headerContainer = document.querySelector("header");
    headerContainer.innerHTML = "";

    const menuContainer = document.createElement("div");
    menuContainer.className = "ui dark large secondary pointing menu";

    const homeLink = document.createElement("a");
    homeLink.className = "item";
    homeLink.href = "#";

    const homeIcon = document.createElement("i");
    homeIcon.className = "fas fa-home";
    homeLink.appendChild(homeIcon);

    const homeText = document.createTextNode(" Home");
    homeLink.appendChild(homeText);

    homeLink.addEventListener("click", () => {
        switchViewCallback("home");
    });

    const githubLink = document.createElement("a");
    githubLink.className = "item";
    githubLink.href = "https://github.com/ttiff/comp3512-assignment2";

    const githubIcon = document.createElement("i");
    githubIcon.className = "fab fa-github";
    githubLink.appendChild(githubIcon);

    const githubText = document.createTextNode(" GitHub");
    githubLink.appendChild(githubText);

    const favoritesButton = document.createElement("a");
    favoritesButton.className = "item";
    favoritesButton.href = "#";

    const favoritesIcon = document.createElement("i");
    favoritesIcon.className = "fas fa-heart";
    favoritesButton.appendChild(favoritesIcon);

    const favoritesText = document.createTextNode(" Favorites");
    favoritesButton.appendChild(favoritesText);

    favoritesButton.addEventListener("click", () => {
        displayFavoritesPopup();
    });

    menuContainer.appendChild(homeLink);
    menuContainer.appendChild(githubLink);
    menuContainer.appendChild(favoritesButton);
    headerContainer.appendChild(menuContainer);
}


// Toggles between "home" and "browse" views by showing/hiding the respective sections
function switchView(view) {
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");

    if (view === "home") {
        homeView.classList.remove("hidden");
        browseView.classList.add("hidden");
        switchStylesheet("home");

    } else if (view === "browse") {
        homeView.classList.add("hidden");
        browseView.classList.remove("hidden");
        switchStylesheet("browse");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.querySelector("main");
    mainContainer.classList.add("container");
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");
    browseView.classList.add("hidden");
    homeView.classList.remove("hidden");


    // Replace with API data when available
    const seasons = ["2020", "2021", "2022", "2023"];

    // Creates and returns a header element for the homepage 
    function addHeader() {
        const header = document.createElement("h1");
        header.textContent = "Formula 1 Dashboard";
        return header;
    }

    // Creates and returns a description paragraph for the homepage
    function addPageInfo() {
        const pageInfo = document.createElement("p");
        pageInfo.textContent = "MRU COMP 3512 Assignment #2 by Tiffany Tran. Built using HTML, CSS, JavaScript and Semantic UI. Click below to explore race results, driver performances, and more from 2020 - 2023 F1 seasons.";
        return pageInfo;
    }

    // Creates and returns a description paragraph for the homepage.
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
                switchView("browse");
                renderRaces(selectedSeason);
            }
        });

        return container;
    }

    // Populates the season dropdown with options for each available season
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

    // Creates the diagonal homepage layout, including the image section, header, description, and season selection dropdown
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

        diagonalLayout.appendChild(imageSection);
        diagonalLayout.appendChild(textSection);

        homeView.appendChild(diagonalLayout);
    }

    createNavigationBar(switchView);
    addDiagonalLayout();
});

// Switches the active stylesheet based on the current view (home or browse)
export function switchStylesheet(view) {
    const themeStylesheet = document.querySelector("#theme-stylesheet");

    if (view === "home") {
        themeStylesheet.href = "css/style_index.css";
    } else if (view === "browse") {
        themeStylesheet.href = "css/style_browse.css";
    }
}
