const express = require('express');
const router = express.Router();

const pointController = require('../controllers/pointController');

// POINT ROUTES
router.patch('/update', pointController.updatePoints);

module.exports = router;
