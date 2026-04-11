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
  // ✅ FIXED MOCK AI MODE
  // =========================
  if (process.env.LEGAL_AI_MODE === "mock") {

    const q = (question || "").toLowerCase();

    let summary = "";
    let actionItems = [];

    // 🟢 EXPANSION
    if (q.includes("expand") || q.includes("branch")) {
      summary =
        "Before expanding to another branch, ensure local authority approvals, updated trade licences, and compliance with zoning regulations.";

      actionItems = [
        "Update trade licence",
        "Check municipal approvals",
        "Verify tax compliance for multiple locations"
      ];
    }

    // 🟢 STARTUP
    else if (q.includes("startup") || q.includes("launch")) {
      summary =
        "Startups should review business registration, tax registration, contracts, and required industry licences before launching.";

      actionItems = [
        "Register business legally",
        "Obtain tax identification number",
        "Prepare contracts",
        "Check required licences"
      ];
    }

    // 🟢 HIRING (FIXED KEYWORDS)
    else if (
      q.includes("hire") ||
      q.includes("hiring") ||
      q.includes("employee") ||
      q.includes("staff")
    ) {
      summary =
        "Before hiring staff, prepare employment contracts, register for EPF/ETF, and comply with labour laws.";

      actionItems = [
        "Prepare employment contracts",
        "Register EPF/ETF",
        "Follow labour law regulations"
      ];
    }

    // 🟢 DOCUMENTS
    else if (q.includes("document") || q.includes("record")) {
      summary =
        "Organise your business compliance records by maintaining structured documentation for licences, tax filings, and contracts.";

      actionItems = [
        "Maintain digital copies",
        "Organise tax records",
        "Track licence renewals"
      ];
    }

    // 🟢 LICENCES
    else if (q.includes("licence") || q.includes("license")) {
      summary =
        "You should verify trade licences, industry-specific permits, and local authority approvals before operating or expanding your business.";

      actionItems = [
        "Check trade licence",
        "Verify local council approvals",
        "Ensure industry permits"
      ];
    }

    // 🟢 DEFAULT
    else {
      summary =
        "Your business should review licences, tax compliance, and legal requirements to ensure smooth operations.";

      actionItems = [
        "Check business registration",
        "Ensure tax compliance",
        "Verify licences"
      ];
    }

    return {
      parsed: {
        summary,
        riskLevel: "MEDIUM",
        actionItems,
        documentsToConsider: [],
        licencesToCheck: [],
        warnings: [],
        disclaimer: "General guidance only. Not legal advice."
      },
      rawText: "Mock dynamic response",
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