import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/legal/ai/compliance
 * Body: { question }
 */

export const askGeminiCompliance = async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();

    if (!question) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not configured"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const requestedModel = process.env.GEMINI_MODEL?.trim();
    const candidateModels = [
      requestedModel,
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash",
      "gemini-1.5-pro-latest",
      "gemini-1.5-pro",
    ].filter(Boolean);

    const prompt = `
You are a legal and startup compliance assistant for Sri Lanka.
Provide clear, practical, and concise general guidance.
Do NOT provide official legal advice.

User question:
${question}
`;

    let result = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Add timeout protection (prevents hanging forever)
        result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), 12000)
          ),
        ]);
        break;
      } catch (modelError) {
        lastError = modelError;
        const modelMessage = String(modelError?.message || "");

        // Try next candidate only for model-availability errors
        if (
          modelMessage.includes("is not found for API version") ||
          modelMessage.includes("404")
        ) {
          continue;
        }

        throw modelError;
      }
    }

    if (!result && lastError) {
      throw lastError;
    }

    const answer =
      result?.response?.text?.() ||
      "Sorry, I could not generate a response at the moment.";

    return res.status(200).json({
      answer,
      disclaimer:
        "This is AI-generated guidance and not official legal advice.",
      source: "gemini"
    });

  } catch (error) {
    console.error("Gemini Error FULL:", error);

    const message = String(error?.message || "");

    // ✅ If network timeout / fetch failure — return fallback instead of 500
    if (
      message.includes("fetch failed") ||
      message.includes("UND_ERR_CONNECT_TIMEOUT") ||
      message.includes("GEMINI_TIMEOUT") ||
      message.includes("network") ||
      message.includes("is not found for API version") ||
      message.includes("404")
    ) {
      return res.status(200).json({
        answer:
          "The AI service is temporarily unavailable due to a model configuration issue or network timeout. " +
          "Please check GEMINI_MODEL in your server environment and try again. " +
          "Meanwhile, ensure your business registration, tax registration, and required permits are up to date according to Sri Lankan regulations.",
        disclaimer:
          "General guidance only. Not official legal advice.",
        source: "fallback"
      });
    }

    return res.status(500).json({
      message: "Unexpected error while generating answer",
      debug: error?.message || String(error)
    });
  }
};