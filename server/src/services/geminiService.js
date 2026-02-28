import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function safeDiv(a, b) {
  const x = Number(a) || 0;
  const y = Number(b) || 0;
  if (!y) return 0;
  return x / y;
}

export function pct(ratio) {
  return Math.round((Number(ratio) || 0) * 10000) / 100; // 2 decimals
}

export function money(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

export async function analyzeCampaignWithGemini(snapshot) {
  const model = process.env.GEMINI_MODEL || "models/gemini-1.5-flash";

  const systemInstruction =
    "You are a marketing performance analyst. Use ONLY the campaign data provided. Do NOT invent numbers or market facts. Give 3-6 practical prioritized actions. Output JSON only.";

  const responseSchema = {
    type: "object",
    properties: {
      overview: { type: "string" },
      health: { type: "string", enum: ["good", "ok", "poor"] },
      keyFindings: { type: "array", items: { type: "string" } },
      prioritizedActions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            priority: { type: "string", enum: ["high", "medium", "low"] },
            action: { type: "string" },
            reason: { type: "string" },
            expectedImpact: { type: "string" }
          },
          required: ["priority", "action", "reason"]
        }
      },
      metricNotes: {
        type: "object",
        properties: {
          ctrComment: { type: "string" },
          cplComment: { type: "string" },
          cpaComment: { type: "string" },
          clickToLeadComment: { type: "string" },
          clickToSaleComment: { type: "string" }
        }
      },
      missingData: { type: "array", items: { type: "string" } }
    },
    required: ["overview", "health", "prioritizedActions"]
  };

  const prompt = `
Analyze this campaign performance snapshot and return JSON only.

- Interpret the metrics (CTR, CPL, CPA, click->lead, click->sale) if present.
- Identify bottleneck: creative/CTA, targeting, landing page, offer, budget.
- Give 3-6 prioritized actions.
- If any important metric inputs are missing, list them in "missingData".

CAMPAIGN_SNAPSHOT:
${JSON.stringify(snapshot, null, 2)}
`.trim();

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.4
    }
  });

  const text = result.text;

  try {
    return JSON.parse(text);
  } catch {
    return {
      overview: "AI returned invalid JSON. Try again.",
      health: "ok",
      keyFindings: ["Model output parsing failed."],
      prioritizedActions: [
        { priority: "high", action: "Retry analysis", reason: "Model returned invalid JSON." }
      ],
      raw: text
    };
  }
}