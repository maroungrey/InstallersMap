const { installersDb, queryPromise } = require('../db');

const calculateDynamicRadius = (zoom, baseRadius) => {
    return baseRadius * Math.pow(2, (14 - zoom)); // 14 is a "neutral" zoom level
};

const getInstallers = async (table, centerLat, centerLng, radius, minLat, maxLat, minLng, maxLng, zoom, limit) => {
    const dynamicRadius = calculateDynamicRadius(zoom, radius);
    
    const sql = `
        SELECT 
            *,
            ST_Distance_Sphere(location, POINT(?, ?)) / 1000 AS distance_km
        FROM 
            \`${table}\`
        WHERE 
            ST_Within(
                location, 
                ST_Envelope(LINESTRING(POINT(?, ?), POINT(?, ?)))
            )
            OR ST_Distance_Sphere(location, POINT(?, ?)) <= ?
        ORDER BY 
            distance_km
        LIMIT ?
    `;

    const params = [
        centerLng, centerLat,
        minLng, minLat, maxLng, maxLat,
        centerLng, centerLat, dynamicRadius * 1000,
        limit
    ];

    try {
        const results = await queryPromise(installersDb, sql, params);
        return processInstallers(results);
    } catch (error) {
        console.error('Error fetching installers:', error);
        throw error;
    }
};

const processInstallers = (installers) => {
    return installers.map(installer => ({
        id: installer.id,
        name: installer.name,
        address: installer.address,
        phone: installer.phone,
        website: installer.website,
        distance: installer.distance_km,
        pin: {
            lat: installer.latitude,
            lng: installer.longitude
        },
    }));
};

module.exports = {
    getInstallers
};