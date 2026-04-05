import { GoogleGenAI } from "@google/genai";

function buildPrompt({ question, businessProfile }) {
  return `
You are a business legal compliance assistant for small and medium businesses.

IMPORTANT RULES:
- Give only general business legal guidance.
- Do NOT present the response as official legal advice.
- Do NOT invent laws, licence names, or exact legal requirements if uncertain.
- If information depends on country, location, or business type, clearly say the user should verify with a qualified lawyer or local authority.
- Focus on practical steps for an existing or operating business.
- Return STRICT JSON only.
- Do not include markdown.

Return JSON with this exact shape:
{
  "summary": "short paragraph",
  "riskLevel": "LOW or MEDIUM or HIGH",
  "actionItems": ["..."],
  "documentsToConsider": ["..."],
  "licencesToCheck": ["..."],
  "warnings": ["..."],
  "disclaimer": "General guidance only. Not legal advice."
}

USER QUESTION:
${question}

BUSINESS PROFILE:
${JSON.stringify(businessProfile, null, 2)}
`.trim();
}

function extractJson(text) {
  const cleaned = String(text || "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    const maybeJson = cleaned.slice(start, end + 1);
    return JSON.parse(maybeJson);
  }

  throw new Error("AI returned non-JSON output");
}

function normalizeResponse(parsed) {
  return {
    summary: String(parsed?.summary || "No summary generated."),
    riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(parsed?.riskLevel)
      ? parsed.riskLevel
      : "MEDIUM",
    actionItems: Array.isArray(parsed?.actionItems) ? parsed.actionItems : [],
    documentsToConsider: Array.isArray(parsed?.documentsToConsider)
      ? parsed.documentsToConsider
      : [],
    licencesToCheck: Array.isArray(parsed?.licencesToCheck)
      ? parsed.licencesToCheck
      : [],
    warnings: Array.isArray(parsed?.warnings) ? parsed.warnings : [],
    disclaimer:
      parsed?.disclaimer || "General guidance only. Not legal advice."
  };
}

export async function generateLegalComplianceGuidance({ question, businessProfile }) {

  // =========================
  // MOCK AI MODE (for demo/project)
  // =========================
  if (process.env.LEGAL_AI_MODE === "mock") {
    return {
      parsed: {
        summary:
          "Your business should review licences, employee contracts, tax compliance, and local authority approvals before expanding or making legal changes.",
        riskLevel: "MEDIUM",
        actionItems: [
          "Verify business registration details",
          "Review employee contracts and labour law compliance",
          "Ensure tax registration and VAT compliance",
          "Check local council or municipal licences",
          "Update insurance coverage"
        ],
        documentsToConsider: [
          "Business registration certificate",
          "Tax registration documents",
          "Employee contracts",
          "Insurance documents"
        ],
        licencesToCheck: [
          "Trade licence",
          "Industry-specific licence",
          "Health or safety permit"
        ],
        warnings: [
          "Legal requirements vary by country and industry",
          "Consult a qualified lawyer for official legal advice"
        ],
        disclaimer: "General guidance only. Not legal advice."
      },
      rawText: "Mock AI response",
      model: "mock",
      provider: "mock"
    };
  }

  // =========================
  // REAL GEMINI MODE
  // =========================
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const modelName =
      process.env.GEMINI_LEGAL_MODEL ||
      process.env.GEMINI_MODEL ||
      "gemini-2.0-flash";

    const prompt = buildPrompt({ question, businessProfile });

    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json"
      }
    });

    const text = result.text || "";

    const parsed = extractJson(text);
    const normalized = normalizeResponse(parsed);

    return {
      parsed: normalized,
      rawText: text,
      model: modelName,
      provider: "gemini"
    };

  } catch (error) {
    // Fallback if Gemini fails
    return {
      parsed: {
        summary:
          "AI service is currently unavailable. Please review business licences, tax registration, employee contracts, and local regulations manually.",
        riskLevel: "MEDIUM",
        actionItems: [
          "Check business registration",
          "Review tax compliance",
          "Verify employee contracts",
          "Check local licences"
        ],
        documentsToConsider: [],
        licencesToCheck: [],
        warnings: ["AI service unavailable"],
        disclaimer: "General guidance only. Not legal advice."
      },
      rawText: error.message,
      model: "fallback",
      provider: "fallback"
    };
  }
}