const express = require('express');
const router = express.Router();
const { getBatteries } = require('../controllers/batteryController');

router.get('/', getBatteries);

module.exports = router;