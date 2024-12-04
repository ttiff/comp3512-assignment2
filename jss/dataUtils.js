export function updateStorage(data) {
    localStorage.setItem('dashboardData', JSON.stringify(data));
}

export function retrieveStorage() {
    return JSON.parse(localStorage.getItem('dashboardData')) || {};
}

export function removeStorage() {
    localStorage.removeItem('dashboardData');
}

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

export async function fetchDriverDetails(driverId) {
    const driverUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=${driverId}`;

    // console.log("Driver ID:", driverId);
    // console.log("Driver URL:", driverUrl);

    return fetchAndStoreData(driverUrl)
        .then(driverDetails => driverDetails)
        .catch(error => {
            console.error("Error fetching driver details:", error);
            return null;
        });
}

export async function fetchConstructorDetails(constructorId) {
    const constructorUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`;

    // console.log("Constructor ID:", constructorId);
    // console.log("Constructor URL:", constructorUrl);

    return fetchAndStoreData(constructorUrl)
        .then(constructorDetails => constructorDetails)
        .catch(error => {
            console.error("Error fetching constructor details:", error);
            return null;
        });
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || { drivers: [], constructors: [], circuits: [] };
}

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

export function isFavorite(type, id) {
    const favorites = getFavorites();
    return favorites[type].includes(id);
}
