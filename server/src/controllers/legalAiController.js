import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/legal/ai/compliance
 * Body: { question }
 */
export const askGeminiCompliance = async (req, res) => {
  try {
    // Validate question
    const question = String(req.body?.question || "").trim();

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    // Validate Gemini API key
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not configured"
      });
    }

    // Create Gemini client (runtime safe)
    const genAI = new GoogleGenerativeAI(apiKey);

    // Choose model
    const modelName =
      process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

    const model = genAI.getGenerativeModel({
      model: modelName
    });

    // Build prompt
    const prompt = `
You are a legal and startup compliance assistant for Sri Lanka.
Provide clear, practical, and concise general guidance.
Do NOT provide official legal advice.

User question:
${question}
`;

    // Call Gemini
    const result = await model.generateContent(prompt);

    // Extract response text safely
    const answer =
      result?.response?.text?.() ||
      "Sorry, I could not generate a response at the moment.";

    return res.status(200).json({
      answer,
      disclaimer:
        "This is AI-generated guidance and not official legal advice."
    });

  } catch (error) {
    console.error("Gemini Error FULL:", error);

    return res.status(500).json({
      message: "Unexpected error while generating answer",
      debug: error?.message || String(error)
    });
  }
};