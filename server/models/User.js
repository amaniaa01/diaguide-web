const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  weight: Number,
  // Doctor-defined diabetes parameters
  insulinToCarbRatio: {
    type: Number,
    default: 10
  },
  correctionFactor: {
    type: Number,
    default: 50
  },
  targetGlucoseMin: {
    type: Number,
    default: 70
  },
  targetGlucoseMax: {
    type: Number,
    default: 180
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);