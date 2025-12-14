const Booking = require('../models/Booking');
const User = require('../models/User');
const UserPass = require('../models/UserPass'); // Import Model UserPass

exports.createBooking = async (req, res) => {
    try {
        // Tambahkan field 'train_type' dari frontend: 'local' atau 'long_haul'
        const { pariwisata_name, train_name, connecting_transport, origin, destination, date, passengers, price, train_type } = req.body;

        let finalPrice = price;
        let bookingNote = "Regular Booking";

        // --- LOGIKA NUSANTARA PASS ---
        const userPass = await UserPass.findOne({ user: req.user.id, status: 'Active' });
        const travelDate = new Date(date);

        if (userPass) {
            // Cek apakah tanggal travel masih dalam masa berlaku pass
            if (travelDate >= userPass.valid_from && travelDate <= userPass.valid_until) {

                // KASUS 1: Kereta Lokal (Unlimited)
                if (train_type === 'local' || connecting_transport) {
                    finalPrice = 0;
                    bookingNote = `Free via Nusantara Pass Tier ${userPass.tier_level} (Local/Connection)`;
                }
                // KASUS 2: Kereta Jarak Jauh (Cek Kuota)
                else {
                    if (userPass.long_haul_remaining > 0) {
                        // Jika penumpang > 1, pass hanya berlaku untuk pemegang akun (simulasi sederhana: potong kuota sejumlah pax atau tolak)
                        // Disini kita asumsikan 1 pass = 1 user. Jika group booking, logika bisa lebih kompleks.
                        // Kita simulasikan 1 tiket gratis diambil dari kuota.

                        if (passengers === 1) {
                            finalPrice = 0;
                            userPass.long_haul_remaining -= 1;
                            bookingNote = `Free via Nusantara Pass Tier ${userPass.tier_level}`;
                            await userPass.save();
                        }
                    }
                }
            }
        }
        // -----------------------------

        const newBooking = new Booking({
            user: req.user.id,
            pariwisata_tujuan: pariwisata_name,
            train_name,
            connecting_transport,
            origin_station: origin,
            destination_station: destination,
            travel_date: date,
            passengers,
            total_price: finalPrice // Harga update (bisa 0)
        });

        await newBooking.save();

        // Update history user
        const pointsEarned = connecting_transport ? 75 : 50;
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                travel_history: {
                    trip_date: date,
                    destination: destination,
                    train_name: `${train_name} (${bookingNote})`,
                    distance_km: 100
                }
            },
            $inc: { points: pointsEarned }
        });

        res.json({ msg: 'Booking Berhasil!', booking: newBooking, note: bookingNote });
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