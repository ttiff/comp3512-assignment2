import { fetchDriverDetails, fetchConstructorDetails, isFavorite, toggleFavorite } from './dataUtils.js';
import { createConstructorsTable, createDriversTable } from './tableUtils.js';
import { updateRaceTables } from './browseView.js'
import { getCountryCodeByCountry, getCountryCodeByNationality, getFlagUrl, calculateAge, createDetailParagraph, createInfoLink } from './utils.js';

/**
    This module provides utility functions for creating and displaying popups in the SPA.
 */

// Displays a popup with details about a specific constructor.
export async function displayConstructorPopup(id, results, season, raceid) {

    let filteredResults = results.filter(
        c => c.constructor.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        const constructorDetails = await fetchConstructorDetails(id);

        if (filteredResults.length > 0) {
            const constructorPopup = document.querySelector("#constructor");
            constructorPopup.innerHTML = "";
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            createConstructorDetails(filteredResults, constructorDetails, constructorPopup, raceid);

            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                constructorPopup.style.display = "none";
                overlay.style.display = "none";
            });
            constructorPopup.appendChild(closeButtonTop);
            const closeButton = document.createElement("button");
            closeButton.className = "ui button close-button";
            closeButton.textContent = "Close";
            closeButton.addEventListener("click", () => {
                constructorPopup.style.display = "none";
                overlay.style.display = "none";
            });

            constructorPopup.appendChild(closeButton);

            constructorPopup.style.display = "block";
        } else {
            console.warn(`No constructor found with ID ${id} for season ${season}`);
        }
    } catch (error) {
        console.error("Error fetching constructor details:", error);
    }
}

//Generates the content for the constructor popup
export function createConstructorDetails(filteredResults, constructorDetails, targetElement, raceId) {
    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const favoriteIcon = document.createElement("i");
    const constructorId = constructorDetails.constructorId;

    favoriteIcon.className = isFavorite("constructors", constructorId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        toggleFavorite("constructors", constructorId);

        const isNowFavorite = isFavorite("constructors", constructorId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        updateRaceTables(raceId);
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Constructor Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", constructorDetails.name));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Nationality: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${constructorDetails.nationality}`;

    const countryCode = getCountryCodeByNationality(constructorDetails.nationality);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${constructorDetails.nationality} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);

    const infoLink = createInfoLink("Constructor Biography", constructorDetails.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);
    column.appendChild(segment);

    targetElement.appendChild(column);

    const raceDetailsTitle = document.createElement("h3");
    raceDetailsTitle.className = "race-results-title";
    raceDetailsTitle.textContent = "Race Results";

    targetElement.appendChild(raceDetailsTitle);
    targetElement.append(createConstructorsTable(filteredResults));
}

// Displays a popup with details about a specific driver
export async function displayDriverPopup(id, results, season, raceid) {

    let filteredResults = results.filter(
        c => c.driver.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        const driverDetails = await fetchDriverDetails(id);

        if (filteredResults.length > 0) {
            const driverPopup = document.querySelector("#driver");
            driverPopup.innerHTML = "";
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            createDriverDetails(filteredResults, driverDetails, driverPopup, raceid);

            const closeButtonTop = document.createElement("button");
            closeButtonTop.className = "close-button-top";
            closeButtonTop.textContent = "X";
            closeButtonTop.addEventListener("click", () => {
                driverPopup.style.display = "none";
                overlay.style.display = "none";
            });
            driverPopup.appendChild(closeButtonTop);

            const closeButton = document.createElement("button");
            closeButton.className = "ui button close-button";
            closeButton.textContent = "Close";
            closeButton.addEventListener("click", () => {
                driverPopup.style.display = "none";
                overlay.style.display = "none";
            });

            driverPopup.appendChild(closeButton);

            driverPopup.style.display = "block";
        } else {
            console.warn(`No driver found with ID ${id} for season ${season}`);
        }
    } catch (error) {
        console.error("Error fetching driver details:", error);
    }
}

//  Generates the content for the driver popup
export function createDriverDetails(filteredResults, driverDetails, targetElement, raceId) {
    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = `https://placehold.co/300x200?text=${driverDetails.forename || "Driver"}+${driverDetails.surname || "Image"}`;
    image.alt = `${driverDetails.forename || "Driver"} ${driverDetails.surname || "Image"}`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const favoriteIcon = document.createElement("i");
    const driverId = driverDetails.driverId;

    favoriteIcon.className = isFavorite("drivers", driverId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        toggleFavorite("drivers", driverId);

        const isNowFavorite = isFavorite("drivers", driverId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        updateRaceTables(raceId);
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "driver-details";

    const title = document.createElement("h2");
    title.textContent = "Driver Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", `${driverDetails.forename} ${driverDetails.surname}`));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Nationality: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${driverDetails.nationality}`;

    const countryCode = getCountryCodeByNationality(driverDetails.nationality);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${driverDetails.nationality} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);


    detailsContainer.appendChild(createDetailParagraph("Age", calculateAge(driverDetails.dob)));

    const infoLink = createInfoLink("Driver Biography", driverDetails.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);
    column.appendChild(segment);
    targetElement.appendChild(column);

    const raceDetailsTitle = document.createElement("h3");
    raceDetailsTitle.className = "race-results-title";
    raceDetailsTitle.textContent = "Race Results";

    targetElement.appendChild(raceDetailsTitle);

    targetElement.appendChild(createDriversTable(filteredResults || []));
}

// Displays a popup with details about a specific circuit
export function displayCircuitPopup(race) {

    const circuitPopup = document.querySelector("#circuit");
    circuitPopup.innerHTML = "";
    const overlay = document.querySelector("#modal-overlay");
    overlay.style.display = "block";

    createCircuitDetails(race, circuitPopup);

    const closeButtonTop = document.createElement("button");
    closeButtonTop.className = "close-button-top";
    closeButtonTop.textContent = "X";
    closeButtonTop.addEventListener("click", () => {
        circuitPopup.style.display = "none";
        overlay.style.display = "none";
    });
    circuitPopup.appendChild(closeButtonTop);

    const closeButton = document.createElement("button");
    closeButton.className = "ui button close-button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        circuitPopup.style.display = "none";
        overlay.style.display = "none";
    });
    circuitPopup.appendChild(closeButton);

    circuitPopup.style.display = "block";

}

// Generates the content for the circuit popup
export function createCircuitDetails(race, targetElement) {
    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = `https://placehold.co/300x200?text=${race.circuit.name || "Circuit Image"} `;
    image.alt = `${race.circuit.name} "Image"`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const favoriteIcon = document.createElement("i");
    const raceId = race.id;

    favoriteIcon.className = isFavorite("circuits", raceId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        toggleFavorite("circuits", raceId);

        const isNowFavorite = isFavorite("circuits", raceId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        const raceCardIcon = document.querySelector(`[race-id="${raceId}"] .heart-icon`);
        if (raceCardIcon) {
            raceCardIcon.className = isNowFavorite
                ? "heart icon red heart-icon"
                : "heart outline icon heart-icon";
        }
    });

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "favorite-icon-wrapper";
    iconWrapper.appendChild(favoriteIcon);

    segment.appendChild(iconWrapper);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = "circuit-details";

    const title = document.createElement("h2");
    title.textContent = "Circuit Details";
    detailsContainer.appendChild(title);

    detailsContainer.appendChild(createDetailParagraph("Name", race.circuit.name));
    detailsContainer.appendChild(createDetailParagraph("Location", race.circuit.location));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Country: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${race.circuit.country}`;


    const countryCode = getCountryCodeByCountry(race.circuit.country);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${race.country} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);

    const infoLink = createInfoLink("Circuit Biography", race.circuit.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);
}
