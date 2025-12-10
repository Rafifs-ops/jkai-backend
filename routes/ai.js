const express = require('express');
const router = express.Router();
const { getRecommendation, tripPlanner, analyzeReviews, explainBlog } = require('../controllers/aiController');

router.post('/recommendation', getRecommendation);
router.post('/trip-planner', tripPlanner);
router.post('/analyze-reviews', analyzeReviews);
router.post('/explain-blog', explainBlog);

module.exports = router;