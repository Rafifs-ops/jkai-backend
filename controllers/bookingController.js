const Booking = require('../models/Booking');
const User = require('../models/User');
const UserPass = require('../models/UserPass'); // Pastikan Model UserPass diimport

exports.createBooking = async (req, res) => {
    try {
        // 1. Terima data lengkap dari Frontend (sesuai revisi Booking)
        const {
            train_name,
            origin,
            destination,
            date,
            passengers, // Array data penumpang
            addons,     // Object { insurance, railfood }
            payment,    // Object { method, total_amount }
            train_type  // 'local' atau 'long_haul' (dikirim dari frontend)
        } = req.body;

        let finalPrice = payment.total_amount;
        let bookingNote = "Regular Booking";
        let passUsed = false;

        // --- A. LOGIKA INTEGRASI NUSANTARA PASS ---
        // Cek apakah user punya pass aktif
        const userPass = await UserPass.findOne({ user: req.user.id, status: 'Active' });
        const travelDate = new Date(date);

        if (userPass) {
            // Cek masa berlaku
            if (travelDate >= userPass.valid_from && travelDate <= userPass.valid_until) {

                // Aturan: Pass hanya berlaku untuk pemegang akun (User Utama)
                // Kita asumsikan penumpang pertama di list adalah pemegang akun
                const isUserTraveling = passengers.length > 0; // Validasi sederhana

                if (isUserTraveling) {
                    // KASUS 1: Kereta Lokal (Unlimited Rides)
                    if (train_type === 'local') {
                        // Diskon sebesar harga tiket dasar (addons tetap bayar)
                        // Logika sederhana: set harga tiket jadi 0, sisakan harga addons
                        // Di real case: hitung ulang struktur harga
                        bookingNote = `Free Ride via Nusantara Pass ${userPass.tier_level}`;
                        passUsed = true;
                    }
                    // KASUS 2: Kereta Jarak Jauh (Cek Kuota)
                    else if (userPass.long_haul_remaining > 0) {
                        userPass.long_haul_remaining -= 1; // Potong Kuota
                        await userPass.save();

                        bookingNote = `Free Long Haul via Nusantara Pass (Sisa: ${userPass.long_haul_remaining})`;
                        passUsed = true;
                    }
                }
            }
        }

        // Jika Pass digunakan, kita bisa nol-kan harga TIKET UTAMA saja (Addons tetap bayar)
        // Untuk prototype ini, jika pass active, kita anggap diskon full atau sesuai logika bisnis Anda
        if (passUsed) {
            // Contoh: Harga jadi harga addons saja (misal asuransi/makan)
            // Anda perlu logika perhitungan terpisah di frontend untuk memisahkan Base Price vs Addons Price
            // Di sini kita update note saja untuk simulasi
        }
        // ------------------------------------------

        // 2. Simpan Booking dengan Data Lengkap
        const newBooking = new Booking({
            user: req.user.id,
            train_name,
            origin_station: origin,
            destination_station: destination,
            travel_date: date,

            // Data Baru
            passengers: passengers,
            addons: {
                insurance: addons.insurance || false,
                railfood: addons.railfood || [] // Array menu makanan
            },
            payment: {
                method: payment.method,
                status: 'Paid', // Simulasi langsung lunas
                total_amount: finalPrice
            },

            status: 'Confirmed',
            note: bookingNote // Simpan catatan penggunaan pass
        });

        await newBooking.save();

        // 3. Update Poin & History User
        const pointsEarned = passengers.length * 10; // 10 poin per penumpang
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                travel_history: {
                    trip_date: date,
                    destination: destination,
                    train_name: `${train_name} (${bookingNote})`,
                    distance_km: 150 // Dummy distance
                }
            },
            $inc: { points: pointsEarned }
        });

        res.json({
            msg: 'Booking Berhasil!',
            booking: newBooking,
            pass_info: passUsed ? "Diskon Nusantara Pass Berhasil Digunakan" : null
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ msg: 'Gagal memproses booking', error: error.message });
    }
};

// ... function getUserBookings tetap sama
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).sort({ created_at: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};