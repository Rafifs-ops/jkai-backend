const TripPlan = require('../models/TripPlan');

// Simpan Rencana Baru
exports.saveTrip = async (req, res) => {
    try {
        const { destination, days, budget, itinerary } = req.body;
        const newTrip = new TripPlan({
            user: req.user.id,
            destination,
            duration_days: days,
            budget,
            itinerary
        });
        await newTrip.save();
        res.json({ msg: 'Rencana perjalanan berhasil disimpan!', trip: newTrip });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menyimpan trip.' });
    }
};

// Ambil Semua Trip User
exports.getMyTrips = async (req, res) => {
    try {
        const trips = await TripPlan.find({ user: req.user.id }).sort({ created_at: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: 'Gagal mengambil data trip.' });
    }
};

// Update Trip (Fitur Edit)
exports.updateTrip = async (req, res) => {
    try {
        const { itinerary } = req.body;
        const trip = await TripPlan.findByIdAndUpdate(
            req.params.id,
            { itinerary },
            { new: true }
        );
        res.json({ msg: 'Rencana perjalanan diperbarui!', trip });
    } catch (error) {
        res.status(500).json({ error: 'Gagal update trip.' });
    }
};

// Hapus Trip
exports.deleteTrip = async (req, res) => {
    try {
        await TripPlan.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Rencana dihapus.' });
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghapus trip.' });
    }
};