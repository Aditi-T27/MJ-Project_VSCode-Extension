import { geminiModel } from "../utils/geminiClient.js";
import { log } from "../utils/logger.js";

export async function analyzeEdgeCases(code: string) {
  const prompt = `
You are a backend code reviewer. Analyze the following JavaScript/TypeScript backend code.

For each REST API endpoint:
- List the endpoint path and HTTP method.
- Identify input fields (from req.body, req.query, req.params).
- Suggest possible edge cases that might cause errors or unexpected behavior.
- Suggest improvements to make the endpoint more robust (validation, type checks, default values).

Return ONLY a JSON array like:
[
  {
    "method": "POST",
    "endpoint": "/users",
    "inputFields": ["name", "age", "email"],
    "possibleEdgeCases": [
      {"field": "name", "issue": "empty string"},
      {"field": "age", "issue": "string instead of number"}
    ],
    "suggestedImprovements": [
      "Validate that name is non-empty",
      "Ensure age is a number"
    ]
  }
]

Backend code:
${code}
  `;

  const resp = await geminiModel.generateContent(prompt);
  const text = resp.response.text();

  log("\n=== LLM Feedback on Edge Cases ===\n");
  log(text);

  // Parse JSON safely
  try {
    const cleanText = text.replace(/```(?:json)?\n([\s\S]*?)```/, "$1").trim();
    const feedback = JSON.parse(cleanText);
    return feedback;
  } catch (err: any) {
    log("Failed to parse LLM feedback:\n" + text);
    return [];
  }
}
