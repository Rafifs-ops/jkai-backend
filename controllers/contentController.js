const Pariwisata = require('../models/Pariwisata');
const Blog = require('../models/Blog');

// Pariwisata
exports.getAllPariwisata = async (req, res) => {
    try {
        const data = await Pariwisata.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPariwisataById = async (req, res) => {
    try {
        const data = await Pariwisata.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Blog
exports.getAllBlogs = async (req, res) => {
    try {
        const data = await Blog.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const data = await Blog.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};