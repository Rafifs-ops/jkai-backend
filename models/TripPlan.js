const mongoose = require('mongoose');

const TripPlanSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: String, required: true },
    duration_days: Number,
    budget: String,
    itinerary: { type: Array, required: true }, // Menyimpan JSON hasil AI
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TripPlan', TripPlanSchema);