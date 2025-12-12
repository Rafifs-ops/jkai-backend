const express = require('express');
const router = express.Router();
const { saveTrip, getMyTrips, updateTrip, deleteTrip } = require('../controllers/tripController');
const authMiddleware = require('../middleware/auth'); // Import middleware

router.post('/', authMiddleware, saveTrip);
router.get('/', authMiddleware, getMyTrips);
router.put('/:id', authMiddleware, updateTrip);
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;