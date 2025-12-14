const mongoose = require('mongoose');

const GameQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    image: String,
    options: [String], // Array jawaban, misal ["A", "B", "C", "D"]
    answer: String, // Jawaban benar
    points: { type: Number, default: 100 }
});

module.exports = mongoose.model('GameQuestion', GameQuestionSchema);