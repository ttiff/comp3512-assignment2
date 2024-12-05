import { fetchDriverDetails, fetchConstructorDetails, isFavorite, toggleFavorite } from './dataUtils.js';
import { createConstructorsTable, createDriversTable } from './tableUtils.js';
import { updateRaceTables } from './browseView.js'
import { getCountryCodeByCountry, getCountryCodeByNationality, getFlagUrl, calculateAge, createDetailParagraph, createInfoLink } from './utils.js';


export async function displayConstructorPopup(id, constructors, season, raceid) {

    // Filter constructor data for the given id and season
    let filteredResults = constructors.filter(
        c => c.constructor.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchConstructorDetails(id);

        if (filteredResults.length > 0) {
            const constructorPopup = document.querySelector("#constructor");
            constructorPopup.innerHTML = ""; // Clear previous content
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

export function createConstructorDetails(constructor, constructorDetails, targetElement, raceId) {
    console.log("Constructor Details:", constructorDetails);
    console.log("Race ID:", raceId);

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
        console.log("Toggling favorite for constructor ID:", constructorId);
        toggleFavorite("constructors", constructorId);

        // Update only the favorite icon state
        const isNowFavorite = isFavorite("constructors", constructorId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Update the race details without re-rendering the entire tables
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

    // Get the country code and flag URL
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
    targetElement.append(createConstructorsTable(constructor));
}


export async function displayDriverPopup(id, constructors, season, raceid) {

    // Filter constructor data for the given id and season
    let filteredResults = constructors.filter(
        c => c.driver.id === id && c.race.year === season
    );

    filteredResults = filteredResults.sort((a, b) => a.race.round - b.race.round);

    try {
        // Await the result of fetchConstructorDetails
        const constructorDetails = await fetchDriverDetails(id);

        if (filteredResults.length > 0) {
            const driverPopup = document.querySelector("#driver");
            driverPopup.innerHTML = ""; // Clear previous content
            const overlay = document.querySelector("#modal-overlay");
            overlay.style.display = "block";

            // Create and display constructor details
            createDriverDetails(filteredResults, constructorDetails, driverPopup, raceid);

            // Add a close button (top-right)
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
            console.warn(`No constructor found with ID ${id} for season ${season}`);
        }
    } catch (error) {
        console.error("Error fetching constructor details:", error);
    }
}

export function createDriverDetails(driver, driverDetails, targetElement, raceId) {
    console.log("Driver Details:", driverDetails);
    console.log("Race ID:", raceId);

    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment driver-details-container";

    const imageContainer = document.createElement("div");
    imageContainer.className = "driver-image";

    const image = document.createElement("img");
    image.src = `https://placehold.co/300x200?text=${driverDetails.forename || "Driver"}+${driverDetails.surname || "Image"}`;
    image.alt = `${driver.forename || "Driver"} ${driver.surname || "Image"}`;
    imageContainer.appendChild(image);

    segment.appendChild(imageContainer);

    const favoriteIcon = document.createElement("i");
    const driverId = driverDetails.driverId;

    favoriteIcon.className = isFavorite("drivers", driverId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        console.log("Toggling favorite for driver ID:", driverId);
        toggleFavorite("drivers", driverId);

        // Update only the favorite icon state
        const isNowFavorite = isFavorite("drivers", driverId);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Update the race details without re-rendering the entire tables
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

    // Get the country code and flag URL
    const countryCode = getCountryCodeByNationality(driverDetails.nationality);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode); // Helper function to generate the flag URL
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

    targetElement.appendChild(createDriversTable(driver || []));
}


export function displayCircuitPopup(id, race, season) {
    console.log(race);

    const circuitPopup = document.querySelector("#circuit");
    circuitPopup.innerHTML = ""; // Clear previous content
    const overlay = document.querySelector("#modal-overlay");
    overlay.style.display = "block";

    // Create and display constructor details
    createCircuitDetails(race, circuitPopup);

    // Add a close button (top-right)
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


export function createCircuitDetails(circuit, targetElement) {
    console.log("Circuit Details:", circuit);
    console.log("Circuit ID:", circuit.id);

    const column = document.createElement("div");
    column.className = "twelve wide column";

    const segment = document.createElement("div");
    segment.className = "ui segment circuit-details-container";

    // Create the favorite icon for the pop-up
    const favoriteIcon = document.createElement("i");
    const circuitId = circuit.id;

    favoriteIcon.className = isFavorite("circuits", circuitId)
        ? "heart icon red heart-icon"
        : "heart outline icon heart-icon";

    favoriteIcon.addEventListener("click", () => {
        console.log("Toggling favorite for circuit ID:", circuitId);
        toggleFavorite("circuits", circuitId);

        const isNowFavorite = isFavorite("circuits", circuitId);
        console.log("Is now favorite:", isNowFavorite);
        favoriteIcon.className = isNowFavorite
            ? "heart icon red heart-icon"
            : "heart outline icon heart-icon";

        // Update the corresponding race card's heart icon
        const raceCardIcon = document.querySelector(`[race-id="${circuitId}"] .heart-icon`);
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

    detailsContainer.appendChild(createDetailParagraph("Name", circuit.name));
    detailsContainer.appendChild(createDetailParagraph("Location", circuit.circuit.location));

    const countryParagraph = document.createElement("p");
    countryParagraph.className = "country-details";

    const countryLabel = document.createElement("span");
    countryLabel.className = "label-bold";
    countryLabel.textContent = "Country: ";

    const countryValue = document.createElement("span");
    countryValue.className = "country-name";
    countryValue.textContent = ` ${circuit.circuit.country}`;


    const countryCode = getCountryCodeByCountry(circuit.circuit.country);
    const flagImg = document.createElement("img");
    flagImg.className = "country-flag";
    flagImg.src = getFlagUrl(countryCode);
    flagImg.alt = `${circuit.country} flag`;

    countryParagraph.appendChild(countryLabel);
    countryParagraph.appendChild(countryValue);
    countryParagraph.appendChild(flagImg);

    detailsContainer.appendChild(countryParagraph);

    const infoLink = createInfoLink("Circuit Biography", circuit.url);
    detailsContainer.appendChild(infoLink);

    segment.appendChild(detailsContainer);

    column.appendChild(segment);

    targetElement.appendChild(column);
}
