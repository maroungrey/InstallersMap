const { installersDb, queryPromise } = require('../db');

const CLUSTER_DISTANCE = 50; // in pixels, adjust as needed

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

const clusterInstallers = (installers, zoom) => {
  const clustered = [];
  const unclustered = [];

  for (const installer of installers) {
    let addedToCluster = false;

    for (const item of clustered) {
      if (item.type === 'cluster' && isWithinClusterDistance(installer, item, zoom)) {
        item.count++;
        item.lat = (item.lat * (item.count - 1) + installer.pin.lat) / item.count;
        item.lng = (item.lng * (item.count - 1) + installer.pin.lng) / item.count;
        addedToCluster = true;
        break;
      }
    }

    if (!addedToCluster) {
      for (let i = 0; i < unclustered.length; i++) {
        const otherInstaller = unclustered[i];
        if (isWithinClusterDistance(installer, otherInstaller, zoom)) {
          const newCluster = {
            type: 'cluster',
            count: 2,
            lat: (installer.pin.lat + otherInstaller.pin.lat) / 2,
            lng: (installer.pin.lng + otherInstaller.pin.lng) / 2
          };
          clustered.push(newCluster);
          unclustered.splice(i, 1);
          addedToCluster = true;
          break;
        }
      }
    }

    if (!addedToCluster) {
      unclustered.push(installer);
    }
  }

  return [...clustered, ...unclustered];
};

const isWithinClusterDistance = (point1, point2, zoom) => {
  const pixelDistance = getPixelDistance(point1, point2, zoom);
  return pixelDistance <= CLUSTER_DISTANCE;
};

const getPixelDistance = (point1, point2, zoom) => {
  const x1 = longitudeToPixelX(point1.pin ? point1.pin.lng : point1.lng, zoom);
  const y1 = latitudeToPixelY(point1.pin ? point1.pin.lat : point1.lat, zoom);
  const x2 = longitudeToPixelX(point2.pin ? point2.pin.lng : point2.lng, zoom);
  const y2 = latitudeToPixelY(point2.pin ? point2.pin.lat : point2.lat, zoom);

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const longitudeToPixelX = (lng, zoom) => {
  return ((lng + 180) / 360) * Math.pow(2, zoom + 8);
};

const latitudeToPixelY = (lat, zoom) => {
  const sinLat = Math.sin(lat * Math.PI / 180);
  return (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * Math.pow(2, zoom + 8);
};

const processInstaller = (installer) => ({
  type: 'pin',
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