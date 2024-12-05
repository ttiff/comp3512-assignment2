export function getNestedProperty(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

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

export function getFlagUrl(countryCode) {
    return `https://flagcdn.com/w40/${countryCode}.png`;
}

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

export function calculateAge(dob) {
    if (!dob) return "N/A"; // Handle cases where dob is null or undefined

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
}


// Function to create a detail paragraph
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

// Function to create a link element
export function createInfoLink(linkText, url) {
    const paragraph = document.createElement("p");

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.textContent = linkText;

    paragraph.appendChild(link);

    return paragraph;
}
