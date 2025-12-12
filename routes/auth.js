const express = require('express');
const router = express.Router();
const { register, login, updatePoints } = require('../controllers/authController');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth'); // Import middleware

router.post('/register', register);
router.post('/login', login);

// Protected Routes
router.put('/points', authMiddleware, updatePoints);
router.post('/booking', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);

module.exports = router;