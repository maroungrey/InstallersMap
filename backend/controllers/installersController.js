const { getNearbyInstallers: getNearbyInstallersService, getMapInstallers: getMapInstallersService, getTables } = require('../services/installerService');

const getNearbyInstallers = async (table, centerLat, centerLng, radius, limit) => {
  return await getNearbyInstallersService(table, centerLat, centerLng, radius, limit);
};

const getMapInstallers = async (table, minLat, maxLat, minLng, maxLng, zoom) => {
  return await getMapInstallersService(table, minLat, maxLat, minLng, maxLng, zoom);
};

module.exports = {
  getNearbyInstallers,
  getMapInstallers,
  getTables
};