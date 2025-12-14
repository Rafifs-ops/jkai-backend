const mongoose = require('mongoose');

const UserPassSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pass_reference: { type: mongoose.Schema.Types.ObjectId, ref: 'NusantaraPass' },
    tier_level: Number,
    valid_from: Date,
    valid_until: Date,
    long_haul_remaining: Number, // Sisa kuota jarak jauh
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
    addons: {
        gojek_bundle: { type: Boolean, default: false }, // 5x Trip
        kai_porter: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('UserPass', UserPassSchema);