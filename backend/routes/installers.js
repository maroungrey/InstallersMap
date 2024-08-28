const express = require('express');
const router = express.Router();
const { getInstallers, getTables } = require('../controllers/installersController');

router.get('/', async (req, res) => {
    const { table = 'golf-cart' } = req.query;
    try {
        const installers = await getInstallers(table);
        res.json(installers);
    } catch (err) {
        console.error('Error in installers route:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/tables', async (req, res) => {
    try {
        const tables = await getTables();
        res.json(tables);
    } catch (err) {
        console.error('Error fetching tables:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;