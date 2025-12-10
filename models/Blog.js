const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    image_cover: String,
    content: String, // Bisa format HTML/Markdown
    author: String,
    tags: [String],
    release_date: { type: Date, default: Date.now },
    ai_summary: String // Ringkasan otomatis dari AI
});

module.exports = mongoose.model('Blog', BlogSchema);