const express = require('express');
const router = express.Router();
const { getQuestions, seedQuestions } = require('../controllers/gameController');

router.get('/', getQuestions);
router.post('/seed', seedQuestions); // Panggil sekali saja via Postman untuk isi data awal

module.exports = router;