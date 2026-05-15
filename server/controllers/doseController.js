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
   // Fetch nutrition data from Open Food Facts API
let carbsPer100g = 0;
try {
  const response = await axios.get(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=5`,
    { timeout: 8000 }
  );
  const products = response.data.products;
  // Find first product with valid carb data
  for (const product of products) {
    const carbs = product?.nutriments?.carbohydrates_100g ||
                  product?.nutriments?.carbohydrates ||
                  product?.nutriments?.['carbohydrates_value'];
    if (carbs && carbs > 0) {
      carbsPer100g = carbs;
      break;
    }
  }

  // Fallback common foods if API returns 0
  if (carbsPer100g === 0) {
    const commonFoods = {
      'rice': 80, 'white rice': 80, 'brown rice': 76,
      'bread': 49, 'white bread': 49,
      'apple': 14, 'banana': 23, 'orange': 12,
      'potato': 17, 'pasta': 75, 'oats': 66,
      'milk': 5, 'yogurt': 10, 'cheese': 1,
      'chicken': 0, 'beef': 0, 'fish': 0,
      'egg': 1, 'sugar': 100, 'chocolate': 60
    };
    carbsPer100g = commonFoods[foodName.toLowerCase()] || 20;
  }
} catch (err) {
  // Fallback if API fails completely
  const commonFoods = {
    'rice': 80, 'bread': 49, 'apple': 14,
    'banana': 23, 'potato': 17, 'pasta': 75
  };
  carbsPer100g = commonFoods[foodName.toLowerCase()] || 20;
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