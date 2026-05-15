const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addReading,
  getReadings,
  getStats,
  deleteReading
} = require('../controllers/glucoseController');

router.post('/', auth, addReading);
router.get('/', auth, getReadings);
router.get('/stats', auth, getStats);
router.delete('/:id', auth, deleteReading);

module.exports = router;