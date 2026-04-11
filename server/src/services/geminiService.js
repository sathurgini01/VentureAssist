import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiModelName() {
  const raw = String(process.env.GEMINI_MODEL || "gemini-1.5-flash").trim();
  return raw.replace(/^models\//i, "") || "gemini-1.5-flash";
}

function getModelCandidates() {
  const primary = getGeminiModelName();
  const configuredFallbacks = String(process.env.GEMINI_FALLBACK_MODELS || "")
    .split(",")
    .map((item) => item.trim().replace(/^models\//i, ""))
    .filter(Boolean);

  const defaults = [
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];
  return [...new Set([primary, ...configuredFallbacks, ...defaults])];
}

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing on the server.");
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableGeminiError(error) {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("503") ||
    message.includes("service unavailable") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("timeout") ||
    message.includes("deadline exceeded") ||
    message.includes("429")
  );
}

async function generateViaRest(modelName, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`REST ${response.status} ${response.statusText}: ${text}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((item) => item?.text || "").join("") || "";
  if (!text) {
    throw new Error("REST response did not include model text.");
  }

  return text;
}

export function safeDiv(a, b) {
  const x = Number(a) || 0;
  const y = Number(b) || 0;
  if (!y) return 0;
  return x / y;
}

export function pct(ratio) {
  return Math.round((Number(ratio) || 0) * 10000) / 100;
}

export function money(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function extractJson(text) {
  const raw = String(text || "").trim();

  try {
    return JSON.parse(raw);
  } catch {}

  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {}
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch {}
  }

  throw new Error(`Gemini returned non-JSON output: ${raw}`);
}

function normalizeReport(report) {
  return {
    overview: String(report?.overview || "No overview returned."),
    health: ["good", "ok", "poor"].includes(String(report?.health || "").toLowerCase())
      ? String(report.health).toLowerCase()
      : "ok",
    strengths: Array.isArray(report?.strengths) ? report.strengths.map((item) => String(item)) : [],
    weaknesses: Array.isArray(report?.weaknesses) ? report.weaknesses.map((item) => String(item)) : [],
    keyFindings: Array.isArray(report?.keyFindings) ? report.keyFindings.map((item) => String(item)) : [],
    businessAdvice: Array.isArray(report?.businessAdvice) ? report.businessAdvice.map((item) => String(item)) : [],
    prioritizedActions: Array.isArray(report?.prioritizedActions)
      ? report.prioritizedActions
        .map((item) => ({
          priority: ["high", "medium", "low"].includes(String(item?.priority || "").toLowerCase())
            ? String(item.priority).toLowerCase()
            : "medium",
          action: String(item?.action || "").trim(),
          reason: String(item?.reason || "").trim(),
          expectedImpact: String(item?.expectedImpact || "").trim(),
        }))
        .filter((item) => item.action && item.reason)
      : [],
    metricNotes: {
      ctrComment: String(report?.metricNotes?.ctrComment || ""),
      cplComment: String(report?.metricNotes?.cplComment || ""),
      cpaComment: String(report?.metricNotes?.cpaComment || ""),
      clickToLeadComment: String(report?.metricNotes?.clickToLeadComment || ""),
      clickToSaleComment: String(report?.metricNotes?.clickToSaleComment || ""),
    },
    missingData: Array.isArray(report?.missingData) ? report.missingData.map((item) => String(item)) : [],
  };
}

export async function analyzeCampaignWithGemini(snapshot) {
  const genAI = getGeminiClient();
  const candidateModels = getModelCandidates();
  const errors = [];

  const prompt = `
You are a senior marketing performance strategist.

Use ONLY the campaign data below.
Do NOT invent numbers, market facts, audiences, or outcomes.
Compare expected outputs against actual results from tracked metrics.
Explain what performed well, what underperformed, what it means for the business, and what to improve next.

Return STRICT JSON only with this shape:
{
  "overview": "short paragraph",
  "health": "good|ok|poor",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "keyFindings": ["..."],
  "businessAdvice": ["..."],
  "prioritizedActions": [
    {
      "priority": "high|medium|low",
      "action": "...",
      "reason": "...",
      "expectedImpact": "..."
    }
  ],
  "metricNotes": {
    "ctrComment": "...",
    "cplComment": "...",
    "cpaComment": "...",
    "clickToLeadComment": "...",
    "clickToSaleComment": "..."
  },
  "missingData": ["..."]
}

Rules:
- strengths: 3 to 5 items
- weaknesses: 3 to 5 items
- keyFindings: 3 to 6 items
- businessAdvice: 3 to 6 items focused on business growth decisions
- prioritizedActions: 3 to 6 items, ordered from most important to least important
- If expected output is below target, say that clearly.
- If actual results beat target, say that clearly.
- If some important metrics are missing, list them in missingData and mention how that limits confidence.

CAMPAIGN_SNAPSHOT:
${JSON.stringify(snapshot, null, 2)}
`.trim();

  for (const modelName of candidateModels) {
    const model = genAI.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const result = await model.generateContent(prompt);
        const outputText = result?.response?.text?.() || "";
        const parsed = extractJson(outputText);
        const normalized = normalizeReport(parsed);
        return {
          ...normalized,
          modelUsed: modelName,
        };
      } catch (error) {
        const message = error?.message || "Gemini analysis failed.";
        errors.push(`${modelName} attempt ${attempt}: ${message}`);

        if (!isRetryableGeminiError(error)) {
          break;
        }

        if (attempt < 3) {
          await sleep(600 * attempt);
          continue;
        }
      }
    }

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const outputText = await generateViaRest(modelName, prompt);
        const parsed = extractJson(outputText);
        const normalized = normalizeReport(parsed);
        return {
          ...normalized,
          modelUsed: `${modelName} (rest)`,
        };
      } catch (error) {
        const message = error?.message || "Gemini REST analysis failed.";
        errors.push(`${modelName} rest attempt ${attempt}: ${message}`);

        if (!isRetryableGeminiError(error)) {
          break;
        }

        if (attempt < 2) {
          await sleep(700 * attempt);
        }
      }
    }
  }

  throw new Error(`Gemini analysis failed after retries. ${errors.join(" | ")}`);
}
