// routes/installers.js
const express = require('express');
const router = express.Router();
const { getInstallers, getTables } = require('../controllers/installersController');

router.get('/', async (req, res) => {
  const { 
    table = 'golf-cart', 
    centerLat, 
    centerLng, 
    radius = process.env.DEFAULT_RADIUS,
    minLat,
    maxLat,
    minLng,
    maxLng,
    zoom = process.env.DEFAULT_ZOOM,
    limit = process.env.DEFAULT_LIMIT
  } = req.query;

  if (!centerLat || !centerLng || !minLat || !maxLat || !minLng || !maxLng) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const tables = await getTables();
    if (!tables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const installers = await getInstallers(
      table, 
      parseFloat(centerLat), 
      parseFloat(centerLng), 
      parseFloat(radius),
      parseFloat(minLat),
      parseFloat(maxLat),
      parseFloat(minLng),
      parseFloat(maxLng),
      parseInt(zoom),
      parseInt(limit)
    );
    res.json(installers);
  } catch (err) {
    console.error('Error in installers route:', err);
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