const mongoose = require('mongoose');

const NusantaraPassSchema = new mongoose.Schema({
    tier_name: { type: String, required: true }, // e.g., "Tier 1 (The City Hopper)"
    tier_level: { type: Number, required: true }, // 1, 2, 3
    duration_days: { type: Number, required: true },
    price: { type: Number, required: true },
    long_haul_quota: { type: Number, required: true }, // Kuota kereta jarak jauh
    monthly_stock: { type: Number, required: true }, // Stok untuk Ticket War
    stock_sold: { type: Number, default: 0 },
    description: String,
    features: [String] // e.g., ["Unlimited Local Transport", "2x Long Haul"]
});

module.exports = mongoose.model('NusantaraPass', NusantaraPassSchema);