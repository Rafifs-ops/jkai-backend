const mongoose = require('mongoose');

const PariwisataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true }, // Untuk URL SEO friendly
    images: [String], // Array URL gambar
    location: {
        address: String,
        city: String,
        coordinates: { lat: Number, lng: Number }
    },
    nearest_station: {
        name: String,
        distance_km: Number,
        travel_time_minutes: Number
    },
    details: {
        summary: String,
        contact: String,
        open_hours: String,
        ticket_price_range: String
    },
    guide: {
        how_to_get_there: String,
        tips: [String] // Array tips
    },
    // Data review bisa diambil dari scraping Google Maps atau user input
    reviews_data: [
        {
            source: { type: String, enum: ['google', 'social_media', 'internal'] },
            user_name: String,
            comment: String,
            rating: Number,
            date: Date
        }
    ],
    ai_analysis_cache: { type: String } // Menyimpan hasil analisis AI agar tidak request berulang kali
});

module.exports = mongoose.model('Pariwisata', PariwisataSchema);