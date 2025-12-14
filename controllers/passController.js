const NusantaraPass = require('../models/NusantaraPass');
const UserPass = require('../models/UserPass');
const User = require('../models/User');

// 1. Get All Passes (Untuk Halaman Ticket War)
exports.getAllPasses = async (req, res) => {
    try {
        const passes = await NusantaraPass.find();
        res.json(passes);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};

// 2. Buy Pass
exports.buyPass = async (req, res) => {
    const { passId, addOns } = req.body; // addOns: { gojek: true, porter: true }

    try {
        const pass = await NusantaraPass.findById(passId);

        // Cek Stok (Ticket War Logic)
        if (pass.stock_sold >= pass.monthly_stock) {
            return res.status(400).json({ msg: "Yah, Kuota Habis! Coba lagi bulan depan." });
        }

        // Cek apakah user sudah punya pass aktif
        const existingPass = await UserPass.findOne({ user: req.user.id, status: 'Active' });
        if (existingPass) {
            return res.status(400).json({ msg: "Kamu masih punya pass yang aktif." });
        }

        // Hitung Tanggal
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + pass.duration_days);

        // Create User Pass
        const newUserPass = new UserPass({
            user: req.user.id,
            pass_reference: pass._id,
            tier_level: pass.tier_level,
            valid_from: startDate,
            valid_until: endDate,
            long_haul_remaining: pass.long_haul_quota,
            addons: {
                gojek_bundle: addOns.gojek || false,
                kai_porter: addOns.porter || false
            }
        });

        await newUserPass.save();

        // Update Stock Global
        pass.stock_sold += 1;
        await pass.save();

        res.json({ msg: "Pembelian Berhasil! Nusantara Pass Aktif.", data: newUserPass });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal membeli pass" });
    }
};

// 3. Cek Pass Saya
exports.getMyPass = async (req, res) => {
    try {
        const myPass = await UserPass.findOne({ user: req.user.id, status: 'Active' }).populate('pass_reference');

        // Cek Expired Logic sederhana
        if (myPass && new Date() > new Date(myPass.valid_until)) {
            myPass.status = 'Expired';
            await myPass.save();
            return res.json(null);
        }

        res.json(myPass);
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};