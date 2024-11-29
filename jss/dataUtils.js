
export function updateStorage(data) {
    sessionStorage.setItem('dashboardData', JSON.stringify(data));
}

export function retrieveStorage() {
    return JSON.parse(sessionStorage.getItem('dashboardData')) || {};
}

export function removeStorage() {
    sessionStorage.removeItem('dashboardData');
}

export async function fetchAndStoreData(url) {
    let data = retrieveStorage();

    // Check if the data for the given URL already exists
    if (!data[url]) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
            const result = await response.json();

            // Add fetched data to the storage object and update session storage
            data[url] = result;
            updateStorage(data);
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
            return null;
        }
    }

    return data[url];
}

export async function fetchDriverDetails(driverId) {
    const driverUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/drivers.php?id=${driverId}`;

    console.log("Driver ID:", driverId);
    console.log("Driver URL:", driverUrl);

    try {
        const driverDetails = await fetchAndStoreData(driverUrl);
        return driverDetails;
    } catch (error) {
        console.error("Error fetching driver details:", error);
        return null;
    }
}

export async function fetchConstructorDetails(constructorId) {
    const constructorUrl = `https://www.randyconnolly.com/funwebdev/3rd/api/f1/constructors.php?id=${constructorId}`;
    console.log("Constructor ID:", constructorId);
    console.log("Constructor URL:", constructorUrl);

    try {
        const constructorDetails = await fetchAndStoreData(constructorUrl);
        return constructorDetails;
    } catch (error) {
        console.error("Error fetching constructor details:", error);
        return null;
    }
}

