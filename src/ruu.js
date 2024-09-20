const evData = {
    "geometry": "POLYGON ((8.507704049567158 50.09435131088914, 8.50774916279031 50.08994771915968, 8.50077341211077 50.089917933033085, 8.500727659646532 50.09432152014064, 8.507704049567158 50.09435131088914))",
    "EV_stations": 2
};

// Function to extract coordinates and create EV station placements
const createEvStationPlacements = (data) => {
    const coordinatesString = data.geometry.slice(10, -2);
    const coordsArray = coordinatesString.split(", ");

    const evStations = data.EV_stations;
    const placements = [];

    // Convert coordinates to number
    const coords = coordsArray.map(coord => coord.split(" ").map(Number));

    // Calculate the center of the polygon
    const centerLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
    const centerLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;

    // Generate EV station placements
    if (evStations === 1) {
        placements.push({ lat: centerLat, lng: centerLng });
    } else {
        const spacing = 0.0001; // Adjust spacing to prevent overlap
        let count = 0;

        for (let i = 0; i < evStations; i++) {
            const latOffset = (i % Math.ceil(Math.sqrt(evStations))) * spacing;
            const lngOffset = Math.floor(i / Math.ceil(Math.sqrt(evStations))) * spacing;

            placements.push({
                lat: centerLat + latOffset,
                lng: centerLng + lngOffset
            });
        }
    }

    return placements;
};

const evStationPlacements = createEvStationPlacements(evData);
console.log(evStationPlacements);
