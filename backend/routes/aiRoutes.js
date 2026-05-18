const express = require('express');
const router = express.Router();
const {
  getRecommendation,
  rankEmployees,
  getBatchRecommendations
} = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

// All routes are protected
router.use(authMiddleware);

// AI routes
router.post('/recommend', getRecommendation);
router.get('/rank', rankEmployees);
router.get('/batch-recommendations', getBatchRecommendations);

module.exports = router;
