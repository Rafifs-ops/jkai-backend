const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { seedPasses, getAllPasses, buyPass, getMyPass } = require('../controllers/passController');

router.get('/', getAllPasses);
router.post('/buy', authMiddleware, buyPass);
router.get('/my-pass', authMiddleware, getMyPass);

module.exports = router;