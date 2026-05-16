const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/fcm-token', auth, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    await require('../models/User').findByIdAndUpdate(
      req.user.id,
      { fcmToken }
    );
    res.json({ message: 'FCM token saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;