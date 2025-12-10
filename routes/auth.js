const express = require('express');
const router = express.Router();
const { register, login, updatePoints } = require('../controllers/authController');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const jwt = require('jsonwebtoken');

// Middleware sederhana untuk cek token
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

router.post('/register', register);
router.post('/login', login);
router.put('/points', authMiddleware, updatePoints); // Endpoint baru
router.post('/booking', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);

module.exports = router;