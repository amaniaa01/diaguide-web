const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getWeeklyReport = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a diabetes education assistant for Type 1 diabetes patients. 
    Generate a short friendly weekly educational report (max 150 words) with one practical tip about managing Type 1 diabetes.
    Never give personalized medical advice. Always recommend consulting a doctor.
    Keep language simple and encouraging.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ report: text });

  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ 
      message: 'AI service error', 
      error: err.message,
      report: 'Educational content temporarily unavailable. Please try again later.' 
    });
  }
};