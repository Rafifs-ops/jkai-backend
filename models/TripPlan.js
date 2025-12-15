const mongoose = require('mongoose');

const TripPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    duration_days: Number,
    people: { type: Number, default: 1 }, // Added
    notes: String, // Added
    budget: String,
    itinerary: { type: Array, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TripPlan', TripPlanSchema);