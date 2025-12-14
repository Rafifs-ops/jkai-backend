const GameQuestion = require('../models/GameQuestion');

exports.getQuestions = async (req, res) => {
    try {
        // Ambil 5 soal random
        const questions = await GameQuestion.aggregate([{ $sample: { size: 5 } }]);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ msg: 'Gagal mengambil data soal' });
    }
};

// Endpoint untuk seeding data awal (biar tidak kosong)
exports.seedQuestions = async (req, res) => {
    const data = [
        {
            question: "Landmark apakah ini yang terletak di Sumatera Barat?",
            image: "https://upload.wikimedia.org/wikipedia/commons/4/40/Jam_Gadang_Bukittinggi.jpg",
            options: ["Jam Gadang", "Monas", "Gedung Sate", "Benteng Kuto Besak"],
            answer: "Jam Gadang"
        },
        {
            question: "Stasiun kereta api tertinggi di Indonesia adalah?",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Nagreg_Station.jpg/640px-Nagreg_Station.jpg",
            options: ["Stasiun Bandung", "Stasiun Nagreg", "Stasiun Lebakjero", "Stasiun Malang"],
            answer: "Stasiun Nagreg"
        }
        // Tambahkan soal lain disini...
    ];
    await GameQuestion.insertMany(data);
    res.json({ msg: "Seeded!" });
};