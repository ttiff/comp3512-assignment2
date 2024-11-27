
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
