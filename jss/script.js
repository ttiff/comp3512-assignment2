import { renderRaces, displayFavoritesPopup } from "./browseView.js";
import { addDiagonalLayout } from "./homeView.js";

/**
    Initializes and manages the Single Page Application (SPA) functionality.
    Handles view switching, navigation bar creation, and homepage layout.
 */

// Creates the navigation bar with links to "Home", "GitHub", and "Favorites"
export function createNavigationBar(switchViewCallback) {
    const headerContainer = document.querySelector("header");
    headerContainer.innerHTML = "";

    const menuContainer = document.createElement("div");
    menuContainer.className = "ui dark large secondary pointing menu";

    const homeLink = document.createElement("a");
    homeLink.className = "item";
    homeLink.id = "nav-home";
    homeLink.href = "#";

    const homeIcon = document.createElement("i");
    homeIcon.className = "fas fa-home";
    homeLink.appendChild(homeIcon);

    const homeText = document.createTextNode(" Home");
    homeLink.appendChild(homeText);

    homeLink.addEventListener("click", () => {
        switchViewCallback("home");
        setActiveNavItem("home");
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
    favoritesButton.id = "nav-favorites";
    favoritesButton.href = "#";

    const favoritesIcon = document.createElement("i");
    favoritesIcon.className = "fas fa-heart";
    favoritesButton.appendChild(favoritesIcon);

    const favoritesText = document.createTextNode(" Favorites");
    favoritesButton.appendChild(favoritesText);

    favoritesButton.addEventListener("click", () => {
        displayFavoritesPopup();
        setActiveNavItem("favorites");
    });

    menuContainer.appendChild(homeLink);
    menuContainer.appendChild(githubLink);
    menuContainer.appendChild(favoritesButton);
    headerContainer.appendChild(menuContainer);
}

// Helper function to set the active navigation item
function setActiveNavItem(activeId) {
    const navItems = document.querySelectorAll(".ui.dark.menu .item");
    navItems.forEach((item) => item.classList.remove("active")); // Remove active class from all items

    const activeItem = document.querySelector(`#nav-${activeId}`);
    if (activeItem) {
        activeItem.classList.add("active"); // Add active class to the selected item
    }
}

// Toggles between "home" and "browse" views
function switchView(view) {
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");

    if (view === "home") {
        homeView.classList.remove("hidden");
        browseView.classList.add("hidden");
        switchStylesheet("home");
        setActiveNavItem("home"); // Highlight the Home nav button
    } else if (view === "browse") {
        homeView.classList.add("hidden");
        browseView.classList.remove("hidden");
        switchStylesheet("browse");
        setActiveNavItem("browse"); // Highlight the appropriate nav button (if applicable)
    }
}


// Switches the active stylesheet for the current view
export function switchStylesheet(view) {
    const themeStylesheet = document.querySelector("#theme-stylesheet");

    if (view === "home") {
        themeStylesheet.href = "css/style_index.css";
    } else if (view === "browse") {
        themeStylesheet.href = "css/style_browse.css";
    }
}

// Initializes the application on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.querySelector("main");
    mainContainer.classList.add("container");
    const homeView = document.querySelector("#home");
    const browseView = document.querySelector("#browse");
    browseView.classList.add("hidden");
    homeView.classList.remove("hidden");

    const seasons = ["2020", "2021", "2022", "2023"];

    createNavigationBar(switchView);
    setActiveNavItem("home");
    const diagonalLayout = addDiagonalLayout(seasons, switchView, renderRaces);
    homeView.appendChild(diagonalLayout);
});
