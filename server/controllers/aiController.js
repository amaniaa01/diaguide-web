const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getWeeklyReport = async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a diabetes education assistant for Type 1 diabetes patients. 
    Generate a short, friendly weekly educational report (max 200 words) about managing Type 1 diabetes.
    Focus on one practical tip about: blood sugar monitoring, diet, exercise, or insulin management.
    
    IMPORTANT RULES:
    - Never give personalized medical advice
    - Always recommend consulting a doctor
    - Keep language simple and encouraging
    - End with a safety disclaimer
    
    Generate the report now:`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ report: text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI service error', report: null });
  }
};