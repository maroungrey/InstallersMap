const express = require('express');
const router = express.Router();
const { getAllInstallers } = require('../dal/installers');

router.get('/', (req, res) => {
    getAllInstallers((err, installers) => {
        if (err) {
            console.error('Error fetching installers:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(installers);
    });
});

module.exports = router;