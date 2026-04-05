import { ApiError } from "../utils/ApiError.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

function buildPrompt(idea) {
  return `
Return STRICT JSON only (no markdown) with keys:
strengths, weaknesses, opportunities, threats.
Each should be an array of 5-8 short bullet strings.

Startup idea details:
Title: ${idea.title}
Summary: ${idea.summary || ""}
Problem: ${idea.problem || ""}
Solution: ${idea.solution || ""}
Target Customer: ${idea.targetCustomer || ""}
Location/Market: ${idea.location || ""}
Uniqueness: ${idea.uniqueness || ""}
Resources: ${idea.resources || ""}
Challenges/Risks: ${idea.challenges || ""}
Opportunities: ${idea.opportunities || ""}
Revenue Model: ${idea.revenueModel || ""}
Next 1 month goal: ${idea.nextMonthGoal || ""}
`.trim();
}

function tryParseJson(text) {
  const t = (text || "").trim();

  // direct parse
  try { return JSON.parse(t); } catch {}

  // extract first {...}
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const maybe = t.slice(start, end + 1);
    try { return JSON.parse(maybe); } catch {}
  }

  throw new ApiError(502, "AI returned non-JSON output");
}

function validateSwot(parsed) {
  for (const k of ["strengths", "weaknesses", "opportunities", "threats"]) {
    if (!Array.isArray(parsed?.[k])) throw new ApiError(502, `AI JSON missing ${k}`);
  }
}

export async function generateSwotFromAI(idea) {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const prompt = buildPrompt(idea);

  // ✅ GEMINI
  if (provider === "gemini") {
    if (!process.env.GEMINI_API_KEY) throw new ApiError(500, "GEMINI_API_KEY missing in .env");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash"
    });

    const result = await model.generateContent(prompt);
    const outputText = result.response.text();

    const parsed = tryParseJson(outputText);
    validateSwot(parsed);
    return parsed;
  }

  // ✅ OPENAI (existing)
  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) throw new ApiError(500, "OPENAI_API_KEY missing in .env");

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new ApiError(502, `AI API failed: ${text}`);
    }

    const data = await resp.json();
    const outputText = data.output?.[0]?.content?.[0]?.text || "";

    const parsed = tryParseJson(outputText);
    validateSwot(parsed);
    return parsed;
  }

  throw new ApiError(500, "AI_PROVIDER not supported (use openai or gemini)");
}