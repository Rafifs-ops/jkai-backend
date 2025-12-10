const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    points: { type: Number, default: 0 }, // Poin dari game
    travel_history: [ // Untuk fitur UGC "Rekapan Tahunan"
        {
            trip_date: Date,
            destination: String,
            train_name: String,
            distance_km: Number
        }
    ],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);