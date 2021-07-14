const express = require('express');
const router = express.Router();

const leaderboardController = require('../controllers/leaderboardController');

// LEADERBOARD ROUTES
router.get('/points', leaderboardController.getUserPoints);

module.exports = router;
