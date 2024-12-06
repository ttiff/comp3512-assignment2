/**
    This module provides a collection of functions for common operations used in the SPA
 */

// Retrieves the value of a nested property in an object based on a dot-separated path
export function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

// Sorts an array of objects based on a specific key in ascending or descending order. 
export function sortData(data, key, order = "asc") {
    return data.sort((a, b) => {
        const valA = getNestedProperty(a, key);
        const valB = getNestedProperty(b, key);

        // Handle strings (case-insensitive)
        const valueA = typeof valA === "string" ? valA.toLowerCase() : valA;
        const valueB = typeof valB === "string" ? valB.toLowerCase() : valB;

        if (valueA < valueB) return order === "asc" ? -1 : 1;
        if (valueA > valueB) return order === "asc" ? 1 : -1;
        return 0;
    });
}

// Constructs the URL for a country's flag image based on its ISO country code
export function getFlagUrl(countryCode) {
    return `https://flagcdn.com/w40/${countryCode}.png`;
}

// Maps a country's name to its ISO country code. Returns a default code (`'un'`) for unknown countries.
export function getCountryCodeByCountry(country) {
    const countryCodes = {
        'Bahrain': 'bh',
        'Saudi Arabia': 'sa',
        'Australia': 'au',
        'Italy': 'it',
        'USA': 'us',
        'Spain': 'es',
        'Monaco': 'mc',
        'Azerbaijan': 'az',
        'Canada': 'ca',
        'UK': 'gb',
        'Austria': 'at',
        'France': 'fr',
        'Hungary': 'hu',
        'Belgium': 'be',
        'Netherlands': 'nl',
        'Singapore': 'sg',
        'Japan': 'jp',
        'Mexico': 'mx',
        'Brazil': 'br',
        'UAE': 'ae',
        'Germany': 'de',
        'Switzerland': 'ch',
        'Thailand': 'th',
        'China': 'cn',
        'Denmark': 'dk',
        'Finland': 'fi',
        'Japan': 'jp',
        'South Africa': 'za',
        'India': 'in'
    };

    const defaultFlag = 'un';

    return countryCodes[country] || defaultFlag;
}

//  Maps a driver's nationality to its ISO country code. Returns a default code (`'un'`) for unknown nationalities.
export function getCountryCodeByNationality(nationality) {
    const nationalityCodes = {
        'Monegasque': 'mc',
        'Spanish': 'es',
        'British': 'gb',
        'Danish': 'dk',
        'Finnish': 'fi',
        'French': 'fr',
        'Japanese': 'jp',
        'Chinese': 'cn',
        'German': 'de',
        'Canadian': 'ca',
        'Thai': 'th',
        'Australian': 'au',
        'Mexican': 'mx',
        'Dutch': 'nl',
        'Swiss': 'ch',
        'Italian': 'it',
        'American': 'us',
        'Austrian': 'at'
    };

    const defaultFlag = 'un';

    return nationalityCodes[nationality] || defaultFlag;
}

// Calculates the age based on a given date of birth. Returns `"N/A"` if the `dob` is invalid or undefined.
export function calculateAge(dob) {
    if (!dob) return "N/A"; // Handle cases where dob is null or undefined

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
}

export function createDetailParagraph(labelText, valueText) {
    const paragraph = document.createElement("p");

    const label = document.createElement("span");
    label.className = "label-bold";
    label.textContent = `${labelText}: `;

    const value = document.createElement("span");
    value.textContent = valueText;

    paragraph.appendChild(label);
    paragraph.appendChild(value);

    return paragraph;
}

export function createInfoLink(linkText, url) {
    const paragraph = document.createElement("p");

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = linkText;

    paragraph.appendChild(link);

    return paragraph;
}
