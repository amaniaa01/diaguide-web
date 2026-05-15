const mongoose = require('mongoose');

const GlucoseReadingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  context: {
    type: String,
    enum: ['Before Meal', 'After Meal', 'Fasting', 'Exercise'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('GlucoseReading', GlucoseReadingSchema);