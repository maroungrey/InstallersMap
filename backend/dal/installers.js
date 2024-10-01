const { installersDb } = require('../db');

const getMapData = (bounds, center, zoom, callback) => {
    // Parse the bounds, center, and zoom
    const [south, west, north, east] = bounds.split(',').map(Number);
    const [centerLat, centerLng] = center.split(',').map(Number);
    const zoomLevel = Number(zoom);

    // Calculate the visible area and cluster size based on zoom level
    const visibleArea = (north - south) * (east - west);
    const clusterSize = calculateClusterSize(visibleArea, zoomLevel);

    const sql = `
        SELECT 
            FLOOR(latitude / ?) * ? as lat_group,
            FLOOR(longitude / ?) * ? as lng_group,
            COUNT(*) as count,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', id,
                    'name', name,
                    'latitude', latitude,
                    'longitude', longitude
                )
            ) as businesses
        FROM \`golf-cart\`
        WHERE latitude BETWEEN ? AND ?
          AND longitude BETWEEN ? AND ?
        GROUP BY lat_group, lng_group
    `;

    installersDb.query(sql, [clusterSize, clusterSize, clusterSize, clusterSize, south, north, west, east], (err, results) => {
        if (err) {
            return callback(err);
        }
        callback(null, results);
    });
};

const calculateClusterSize = (visibleArea, zoomLevel) => {
    // Implement logic to determine appropriate cluster size
    // This is a simplified example; you may need to adjust based on your specific needs
    return Math.max(0.1, Math.min(1, visibleArea / (1000 * Math.pow(2, zoomLevel))));
};

module.exports = {
    getMapData
};