const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    train_name: { type: String, required: true },
    origin_station: String,
    destination_station: String,
    travel_date: Date,

    // DETAIL BARU
    passengers: [{
        name: String,
        id_card: String, // NIK/Paspor
        type: { type: String, enum: ['Adult', 'Child', 'Infant'] },
        seat_number: String // Misal "Eksekutif 1 / 12A"
    }],
    addons: {
        insurance: { type: Boolean, default: false },
        insurance_provider: String,
        railfood: [{
            item: String,
            qty: Number,
            price: Number
        }]
    },
    payment: {
        method: String, // QRIS, Transfer, dll
        status: { type: String, default: 'Paid' }, // Simulasi langsung bayar
        total_amount: Number
    },

    status: { type: String, default: 'Confirmed' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);