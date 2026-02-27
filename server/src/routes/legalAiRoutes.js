import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { askGeminiCompliance } from "../controllers/legalAiController.js";

const router = express.Router();

router.post("/ai/compliance", protectMarketing, async (req, res) => {
  try {
    const { question } = req.body;

    // 1️⃣ Validate input
    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        message: "Question is required"
      });
    }

    // 2️⃣ Check API key
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(500).json({
        message: "GEMINI_API_KEY is not configured in .env"
      });
    }

    // 3️⃣ Model (can override via .env)
    const model =
      process.env.GEMINI_MODEL?.trim() || "gemini-1.5-flash";

    const apiBase =
      process.env.GEMINI_API_BASE_URL?.trim() ||
      "https://generativelanguage.googleapis.com/v1beta";

    // 4️⃣ Build request payload
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are a legal and business compliance assistant for Sri Lanka.
Provide clear, practical and concise guidance.
Do NOT provide official legal advice.
User question: ${question}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    };

    // 5️⃣ Call Gemini API
    const response = await fetch(
      `${apiBase}/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.error("Gemini FULL Error:", data);

  return res.status(response.status).json({
    message: "Gemini upstream error",
    geminiStatus: response.status,
    geminiError: data
  });
}

    // 6️⃣ Extract answer safely
    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text)
        .filter(Boolean)
        .join("\n") ||
      "Sorry, I could not generate a response right now.";

    return res.status(200).json({
      answer,
      disclaimer:
        "This is AI-generated guidance and not official legal advice."
    });

  } catch (error) {
    console.error("Unexpected Gemini Error:", error);
    return res.status(500).json({
      message: "Unexpected error while generating answer"
    });
  }
});

router.post("/ai/compliance", protectMarketing, askGeminiCompliance);

export default router;