const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { calculateDose, getDoseHistory } = require('../controllers/doseController');

router.post('/calculate', auth, calculateDose);
router.get('/history', auth, getDoseHistory);

module.exports = router;