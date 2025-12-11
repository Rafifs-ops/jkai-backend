const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res) => {
    try {
        const { pariwisata_name, train_name, connecting_transport, origin, destination, date, passengers, price } = req.body;

        // 1. Simpan Data Booking
        const newBooking = new Booking({
            user: req.user.id,
            pariwisata_tujuan: pariwisata_name,
            train_name,
            connecting_transport,
            origin_station: origin,
            destination_station: destination,
            travel_date: date,
            passengers,
            total_price: price
        });

        await newBooking.save();

        // Update history user (User mendapat poin lebih jika pesan tiket terusan)
        const pointsEarned = connecting_transport ? 75 : 50;

        // 2. Update History User (Untuk fitur UGC "Rekapan Tahunan")
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                travel_history: {
                    trip_date: date,
                    destination: destination,
                    train_name: connecting_transport ? `${train_name} + ${connecting_transport}` : train_name,
                    distance_km: 100
                }
            },
            $inc: { points: pointsEarned }
        });

        res.json({ msg: 'Booking Berhasil!', booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ created_at: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};