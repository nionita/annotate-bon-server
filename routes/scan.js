const express = require('express');

const scanController = require('../controllers/scan');

const router = express.Router();

router.get('/scans', scanController.getScans);

module.exports = router;