const express = require('express');
const router = express.Router();
const { saveTrip, getMyTrips, updateTrip, deleteTrip } = require('../controllers/tripController');
const jwt = require('jsonwebtoken');

// Middleware Auth (Reused)
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

router.post('/', authMiddleware, saveTrip);
router.get('/', authMiddleware, getMyTrips);
router.put('/:id', authMiddleware, updateTrip);
router.delete('/:id', authMiddleware, deleteTrip);

module.exports = router;