const { installersDb, queryPromise } = require('../db');

const CLUSTER_ZOOM_THRESHOLD = 10; // Adjust this value as needed

const getNearbyInstallers = async (table, centerLat, centerLng, radius, limit) => {
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
  if (zoom < CLUSTER_ZOOM_THRESHOLD) {
    return getClusteredInstallers(table, minLat, maxLat, minLng, maxLng);
  } else {
    return getIndividualInstallers(table, minLat, maxLat, minLng, maxLng);
  }
};

const getClusteredInstallers = async (table, minLat, maxLat, minLng, maxLng) => {
  const sql = `
    SELECT 
      COUNT(*) as count,
      AVG(latitude) as lat,
      AVG(longitude) as lng
    FROM 
      \`${table}\`
    WHERE 
      latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
    GROUP BY 
      FLOOR(latitude * 10) / 10,
      FLOOR(longitude * 10) / 10
  `;

  const params = [minLat, maxLat, minLng, maxLng];

  try {
    const results = await queryPromise(installersDb, sql, params);
    return results.map(cluster => ({
      type: 'cluster',
      count: cluster.count,
      lat: cluster.lat,
      lng: cluster.lng
    }));
  } catch (error) {
    console.error('Error fetching clustered installers:', error);
    throw error;
  }
};

const getIndividualInstallers = async (table, minLat, maxLat, minLng, maxLng) => {
  const sql = `
    SELECT *
    FROM \`${table}\`
    WHERE 
      latitude BETWEEN ? AND ?
      AND longitude BETWEEN ? AND ?
  `;

  const params = [minLat, maxLat, minLng, maxLng];

  try {
    const results = await queryPromise(installersDb, sql, params);
    return results.map(processInstaller);
  } catch (error) {
    console.error('Error fetching individual installers:', error);
    throw error;
  }
};

const processInstaller = (installer) => ({
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
});

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

module.exports = {
    getNearbyInstallers,
    getMapInstallers,
    getTables
  };