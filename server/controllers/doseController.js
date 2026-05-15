const DoseCalculation = require('../models/DoseCalculation');
const User = require('../models/User');
const axios = require('axios');

// Calculate insulin dose
exports.calculateDose = async (req, res) => {
  try {
    const { foodName, quantity, currentGlucose } = req.body;

    // Get user parameters
    const user = await User.findById(req.user.id);
    const { insulinToCarbRatio, correctionFactor, targetGlucoseMin, targetGlucoseMax } = user;

    // Fetch nutrition data from Open Food Facts API
    let carbsPer100g = 0;
    try {
      const response = await axios.get(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=1`
      );
      const product = response.data.products[0];
      carbsPer100g = product?.nutriments?.carbohydrates_100g || 0;
    } catch (err) {
      carbsPer100g = 0;
    }

    // Step 1: Calculate total carbs
    const totalCarbs = (carbsPer100g * quantity) / 100;

    // Step 2: Calculate meal insulin
    const mealInsulin = totalCarbs / insulinToCarbRatio;

    // Step 3: Calculate correction dose
    let correctionDose = 0;
    let warning = '';

    if (currentGlucose < targetGlucoseMin) {
      warning = 'Blood glucose is below target range. Do not inject insulin. Please consume fast-acting carbs.';
      correctionDose = 0;
    } else if (currentGlucose > targetGlucoseMax) {
      correctionDose = (currentGlucose - targetGlucoseMax) / correctionFactor;
    } else {
      correctionDose = 0;
    }

    // Step 4: Total dose
    const totalDose = mealInsulin + correctionDose;

    // Save to database
    const dose = new DoseCalculation({
      userId: req.user.id,
      foodName,
      quantity,
      carbsPer100g,
      totalCarbs: Math.round(totalCarbs * 100) / 100,
      currentGlucose,
      mealInsulin: Math.round(mealInsulin * 100) / 100,
      correctionDose: Math.round(correctionDose * 100) / 100,
      totalDose: Math.round(totalDose * 100) / 100,
      warning
    });

    await dose.save();

    res.json({
      foodName,
      quantity,
      carbsPer100g,
      totalCarbs: Math.round(totalCarbs * 100) / 100,
      mealInsulin: Math.round(mealInsulin * 100) / 100,
      correctionDose: Math.round(correctionDose * 100) / 100,
      totalDose: Math.round(totalDose * 100) / 100,
      warning,
      disclaimer: 'This is a decision-support tool only. Always consult your doctor before adjusting insulin doses.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dose history
exports.getDoseHistory = async (req, res) => {
  try {
    const doses = await DoseCalculation.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(doses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};