import { geminiModel } from "../utils/geminiClient.js";
import { AnalysisResult, Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export async function analyzeCode(code: string): Promise<Endpoint[]> {
  const prompt = `
    Extract all REST API endpoints from the following JavaScript/TypeScript code.
    Return ONLY a JSON array of objects like:
    [
      { "method": "GET", "endpoint": "/users" },
      { "method": "POST", "endpoint": "/login" }
    ]

    Code:
    ${code}
  `;

  const resp = await geminiModel.generateContent(prompt);
  const text = resp.response.text();

  log("\n=== Gemini Extracted Endpoints ===\n");
  log(text);

  let cleanText = text.trim();
  cleanText = cleanText.replace(/```(?:json)?\n([\s\S]*?)```/, "$1").trim();

  try {
    const endpoints = JSON.parse(cleanText);
    if (!Array.isArray(endpoints)) throw new Error("Parsed JSON is not an array");
    return endpoints;
  } catch (err) {
    log("Failed to parse JSON from Gemini response:\n" + cleanText);
    return [];
  }
}
