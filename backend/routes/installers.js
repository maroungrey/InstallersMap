const express = require('express');
const router = express.Router();
const { getNearbyInstallers, getMapInstallers, getTables } = require('../controllers/installersController');

router.get('/nearby', async (req, res) => {
  const { table = 'golf-cart', centerLat, centerLng, radius = 50, limit = 20 } = req.query;

  try {
    const installers = await getNearbyInstallers(table, parseFloat(centerLat), parseFloat(centerLng), parseFloat(radius), parseInt(limit));
    res.json(installers);
  } catch (err) {
    console.error('Error in nearby installers route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

router.get('/map', async (req, res) => {
  const { table = 'golf-cart', minLat, maxLat, minLng, maxLng, zoom } = req.query;

  try {
    const mapData = await getMapInstallers(table, parseFloat(minLat), parseFloat(maxLat), parseFloat(minLng), parseFloat(maxLng), parseInt(zoom));
    res.json(mapData);
  } catch (err) {
    console.error('Error in map installers route:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

router.get('/tables', async (req, res) => {
  try {
    const tables = await getTables();
    res.json(tables);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;