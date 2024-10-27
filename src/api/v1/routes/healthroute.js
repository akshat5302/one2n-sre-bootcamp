const router = require('express').Router();
const healthController = require('../controllers/healthController');

// Health route /health
router.get('/', healthController.healthCheck);

module.exports = router;
