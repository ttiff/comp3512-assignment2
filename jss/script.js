document.addEventListener("DOMContentLoaded", () => {
    const homeView = document.querySelector("#home");

    // Replace with API data when available
    const seasons = ["2020", "2021", "2022", "2023"];

    // Method to create and append the header
    function addHeader() {
        const header = document.createElement("h1");
        header.textContent = "COMP 3512 - F1 Dashboard Project";
        return header;
    }

    // Method to create and append the description paragraph
    function addPageInfo() {
        const pageInfo = document.createElement("p");
        pageInfo.textContent = "Explore race results, driver performances, and more from the 2022 F1 season.";
        return pageInfo;
    }

    // Method to create and append the select element
    function createSeasonSelect() {
        const seasonSelect = document.createElement("select");
        populateSeasonOptions(seasonSelect, seasons);
        return seasonSelect;
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
