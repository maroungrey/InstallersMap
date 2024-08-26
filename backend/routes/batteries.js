const express = require('express');
const router = express.Router();
const { getAllBatteries } = require('../dal/batteries');

router.get('/', (req, res) => {
    getAllBatteries((err, batteries) => {
        if (err) {
            console.error('Error fetching batteries:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(batteries);
    });
});

module.exports = router;