const GlucoseReading = require('../models/GlucoseReading');

// Add a glucose reading
exports.addReading = async (req, res) => {
  try {
    const { value, context, notes } = req.body;

    const reading = new GlucoseReading({
      userId: req.user.id,
      value,
      context,
      notes
    });

    await reading.save();
    res.status(201).json(reading);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all readings for a user
exports.getReadings = async (req, res) => {
  try {
    const readings = await GlucoseReading.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(readings);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reading stats (for circular chart)
exports.getStats = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.user.id);
    const readings = await GlucoseReading.find({ userId: req.user.id });

    const total = readings.length;

    if (total === 0) {
      return res.json({ within: 0, above: 0, below: 0, total: 0 });
    }

    let within = 0, above = 0, below = 0;

    readings.forEach(r => {
      if (r.value < user.targetGlucoseMin) below++;
      else if (r.value > user.targetGlucoseMax) above++;
      else within++;
    });

    res.json({
      total,
      within: Math.round((within / total) * 100),
      above: Math.round((above / total) * 100),
      below: Math.round((below / total) * 100)
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a reading
exports.deleteReading = async (req, res) => {
  try {
    await GlucoseReading.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reading deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};