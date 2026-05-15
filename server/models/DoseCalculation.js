const mongoose = require('mongoose');

const DoseCalculationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  carbsPer100g: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  currentGlucose: {
    type: Number,
    required: true
  },
  mealInsulin: {
    type: Number,
    required: true
  },
  correctionDose: {
    type: Number,
    required: true
  },
  totalDose: {
    type: Number,
    required: true
  },
  warning: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('DoseCalculation', DoseCalculationSchema);