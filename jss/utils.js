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