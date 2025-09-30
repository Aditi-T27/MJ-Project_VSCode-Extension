// import { geminiModel } from "../utils/geminiClient.js";
// import { AnalysisResult, Endpoint } from "../utils/types.js";
// import { log } from "../utils/logger.js";

// export async function analyzeCode(code: string): Promise<Endpoint[]> {
//   const prompt = `
//     Extract all REST API endpoints from the following JavaScript/TypeScript code.
//     Return ONLY a JSON array of objects like:
//     [
//       { "method": "GET", "endpoint": "/users" },
//       { "method": "POST", "endpoint": "/login" }
//     ]

//     Code:
//     ${code}
//   `;

//   const resp = await geminiModel.generateContent(prompt);
//   const text = resp.response.text();

//   log("\n=== Gemini Extracted Endpoints ===\n");
//   log(text);

//   let cleanText = text.trim();
//   cleanText = cleanText.replace(/```(?:json)?\n([\s\S]*?)```/, "$1").trim();

//   try {
//     const endpoints = JSON.parse(cleanText);
//     if (!Array.isArray(endpoints)) throw new Error("Parsed JSON is not an array");
//     return endpoints;
//   } catch (err) {
//     log("Failed to parse JSON from Gemini response:\n" + cleanText);
//     return [];
//   }
// }



import { geminiModel } from "../utils/geminiClient.js";
import { Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export async function analyzeCode(code: string): Promise<Endpoint[]> {
  const prompt = `
    Analyze the following backend JavaScript/TypeScript code.
    Extract all REST API endpoints with these details:
      - "method": HTTP method (GET, POST, PUT, PATCH, DELETE)
      - "endpoint": the route path (e.g., "/users")
      - "body" (optional): if the endpoint expects a request body (for POST, PUT, PATCH),
        provide realistic example data for each field instead of types. Use plausible values
        like names, emails, numbers, booleans, arrays, etc.

    For example, if the code contains:
      app.post("/users", (req, res) => {
        const { name, age } = req.body;
      });

    The output should be:
    [
      { "method": "POST", "endpoint": "/users", "body": { "name": "Aditi", "age": 25 } }
    ]

    Return ONLY a valid JSON array (no explanations or text), like:
    [
      { "method": "GET", "endpoint": "/users" },
      { "method": "POST", "endpoint": "/login", "body": { "username": "aditi123", "password": "pass123" } }
    ]

    Backend Code:
    ${code}
  `;

  const resp = await geminiModel.generateContent(prompt);
  const text = resp.response.text();

  log("\n=== Gemini Extracted Endpoints with Realistic Data ===\n");
  log(text);

  // Remove code fences if present
  let cleanText = text.trim();
  cleanText = cleanText.replace(/```(?:json)?\n([\s\S]*?)```/, "$1").trim();

  try {
    const endpoints = JSON.parse(cleanText);

    if (!Array.isArray(endpoints)) throw new Error("Parsed JSON is not an array");

    return endpoints;
  } catch (err: any) {
    log("Failed to parse JSON from Gemini response:\n" + cleanText);
    log("Error: " + err.message);
    return [];
  }
}
