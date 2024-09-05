// controllers/installersController.js
const { getTables } = require('../db');
const { getInstallers: getInstallersService } = require('../services/installerService');

const getInstallers = async (table, centerLat, centerLng, radius, minLat, maxLat, minLng, maxLng, zoom, limit) => {
    return await getInstallersService(table, centerLat, centerLng, radius, minLat, maxLat, minLng, maxLng, zoom, limit);
};

module.exports = {
    getInstallers,
    getTables
};