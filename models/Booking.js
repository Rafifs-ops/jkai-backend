const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pariwisata_tujuan: { type: String, required: true }, // Nama tempat wisata
    train_name: { type: String, required: true },
    connecting_transport: {
        type: String,
        default: null,
        enum: [null, 'DAMRI Bus', 'Ferry Boat', 'Local Shuttle']
    },
    origin_station: String,
    destination_station: String,
    travel_date: Date,
    passengers: Number,
    total_price: Number,
    status: { type: String, default: 'Confirmed' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);