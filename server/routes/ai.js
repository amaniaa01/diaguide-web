const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWeeklyReport } = require('../controllers/aiController');

router.get('/weekly-report', auth, getWeeklyReport);

module.exports = router;