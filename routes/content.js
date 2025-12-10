const express = require('express');
const router = express.Router();
const { getAllPariwisata, getPariwisataById, getAllBlogs, getBlogById } = require('../controllers/contentController');

router.get('/pariwisata', getAllPariwisata);
router.get('/pariwisata/:id', getPariwisataById);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

module.exports = router;