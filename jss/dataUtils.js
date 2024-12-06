/**This module provides utility functions for managing data storage, retrieval,
 * and interaction with APIs*/

//Stores the provided data object in localStorage under the key 'dashboardData'
export function updateStorage(data) {
    localStorage.setItem('dashboardData', JSON.stringify(data));
}

//Retrieves the 'dashboardData' object from localStorage. Returns an empty object if none exists.
export function retrieveStorage() {
    return JSON.parse(localStorage.getItem('dashboardData')) || {};
}

//Fetches data from the provided URL, caches it in localStorage, and returns the data.
export async function fetchAndStoreData(url) {

    let data = retrieveStorage();

    if (data[url]) {
        return Promise.resolve(data[url]);
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            data[url] = result;
            updateStorage(data);
            return result;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            throw error;
        });
}

// Fetches detailed information about an F1 driver by driver ID and caches the result and returns the driver details.
export async function fetchDriverDetails(driverId) {
    const driverUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=${driverId}`;

    return fetchAndStoreData(driverUrl)
        .then(driverDetails => driverDetails)
        .catch(error => {
            console.error("Error fetching driver details:", error);
            return null;
        });
}

//Fetches detailed information about an F1 constructor by constructor ID and caches the result and returns the constructor details.
export async function fetchConstructorDetails(constructorId) {
    const constructorUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`;

    return fetchAndStoreData(constructorUrl)
        .then(constructorDetails => constructorDetails)
        .catch(error => {
            console.error("Error fetching constructor details:", error);
            return null;
        });
}

// Retrieves the 'favorites' object from localStorage.
export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || { drivers: [], constructors: [], circuits: [] };
}

// Toggles the favorite status of an item (driver, constructor, or circuit) based on its type and ID, updating localStorage.
export function toggleFavorite(type, id) {
    const favorites = getFavorites();
    const index = favorites[type].indexOf(id);
    if (index === -1) {
        favorites[type].push(id);
    } else {
        favorites[type].splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return favorites;
}

// Checks if a specific item (driver, constructor, or circuit) is marked as a favorite in localStorage.
export function isFavorite(type, id) {
    const favorites = getFavorites();
    return favorites[type].includes(id);
}
