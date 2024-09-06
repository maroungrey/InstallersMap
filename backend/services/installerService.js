const { installersDb, queryPromise } = require('../db');
const { cacheWrapper } = require('../utils/cacheUtils');
const { getAdaptiveRadius, clusterInstallers } = require('../utils/mapUtils');

const kmToMiles = (km) => km * 0.621371;

const roundToTwoDecimalPlaces = (number) => Math.round(number * 100) / 100;

const getNearbyInstallers = async (table, centerLat, centerLng, zoom, limit) => {
  const sql = `
    SELECT 
      *,
      ST_Distance_Sphere(location, POINT(?, ?)) / 1000 AS distance_km
    FROM 
      \`${table}\`
    WHERE 
      ST_Distance_Sphere(location, POINT(?, ?)) <= ?
    ORDER BY 
      distance_km
    LIMIT ?
  `;

  const radius = getAdaptiveRadius(zoom);
  const params = [centerLng, centerLat, centerLng, centerLat, radius * 1000, limit];

  try {
    const results = await queryPromise(installersDb, sql, params);
    return results.map(processInstaller);
  } catch (error) {
    console.error('Error fetching nearby installers:', error);
    throw error;
  }
};

const getMapInstallers = async (table, minLat, maxLat, minLng, maxLng, zoom) => {
  const sql = `
    SELECT id, name, address, phone, website, latitude, longitude
    FROM \`${table}\`
    WHERE 
      latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
  `;

  const params = [minLat, maxLat, minLng, maxLng];

  try {
    const results = await queryPromise(installersDb, sql, params);
    const processedResults = results.map(processInstaller);
    return clusterInstallers(processedResults, zoom);
  } catch (error) {
    console.error('Error fetching map installers:', error);
    throw error;
  }
};

const getTables = async () => {
  const sql = 'SHOW TABLES';
  
  try {
    const results = await queryPromise(installersDb, sql);
    return results.map(row => Object.values(row)[0]);
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

const processInstaller = (installer) => {
  const distanceKm = roundToTwoDecimalPlaces(installer.distance_km);
  const distanceMiles = roundToTwoDecimalPlaces(kmToMiles(installer.distance_km));

  return {
    type: 'pin',
    id: installer.id,
    name: installer.name,
    address: installer.address,
    phone: installer.phone,
    website: installer.website,
    distance: `${distanceMiles} miles (${distanceKm} km)`,
    pin: {
      lat: installer.latitude,
      lng: installer.longitude
    },
  };
};

module.exports = {
  getNearbyInstallers: cacheWrapper(getNearbyInstallers, 'nearby', 600),
  getMapInstallers: cacheWrapper(getMapInstallers, 'map', 600),
  getTables: cacheWrapper(getTables, 'tables', 3600),
};