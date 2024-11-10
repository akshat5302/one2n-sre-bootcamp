const express = require('express');
const metricsController = require('./metrics.controller');

const router = express.Router();
router.get('/', metricsController.getMetrics.bind(metricsController));

module.exports = router;
