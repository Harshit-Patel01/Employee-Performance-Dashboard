const express = require('express');
const router = express.Router();
const {
  getRecommendation,
  rankEmployees,
  getBatchRecommendations
} = require('../controllers/aiController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// All AI routes are protected and HR-only
router.use(authMiddleware);
router.use(requireRole('hr'));

// AI routes
router.post('/recommend', getRecommendation);
router.get('/rank', rankEmployees);
router.get('/batch-recommendations', getBatchRecommendations);

module.exports = router;
