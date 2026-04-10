import { generateLegalComplianceGuidance } from "../services/legalAiService.js";

/**
 * POST /api/legal/ai/compliance
 * Body: { question, businessProfile }
 */

export const askGeminiCompliance = async (req, res) => {
  try {
    const question = String(req.body?.question || "").trim();
    const businessProfile = req.body?.businessProfile || {};

    // ❗ Validation
    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // ✅ Call service (handles mock / real AI internally)
    const aiResult = await generateLegalComplianceGuidance({
      question,
      businessProfile,
    });

    // ✅ Safe response structure
    return res.status(200).json({
      answer:
        aiResult?.parsed?.summary ||
        "No response generated. Please try again.",
      details: aiResult?.parsed || {},
      disclaimer:
        aiResult?.parsed?.disclaimer ||
        "General guidance only. Not official legal advice.",
      source: aiResult?.provider || "ai-service",
      model: aiResult?.model || "unknown",
    });

  } catch (error) {
    console.error("AI Error FULL:", error);

    const message = String(error?.message || "");

    // ✅ SAFE FALLBACK (VERY IMPORTANT FOR DEMO)
    if (
      message.includes("fetch") ||
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("404") ||
      message.includes("model")
    ) {
      return res.status(200).json({
        answer:
          "The AI service is temporarily unavailable. Please try again later. " +
          "Meanwhile, ensure your business registration, tax compliance, and required licences are properly maintained according to Sri Lankan regulations.",
        disclaimer:
          "General guidance only. Not official legal advice.",
        source: "fallback",
      });
    }

    // ❗ Unexpected error
    return res.status(500).json({
      message: "Unexpected error while generating answer",
      debug: error?.message || String(error),
    });
  }
};