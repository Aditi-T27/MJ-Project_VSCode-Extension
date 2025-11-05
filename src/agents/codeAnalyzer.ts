import { geminiModel } from "../utils/geminiClient.js";
import { Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export async function analyzeCode(code: string): Promise<Endpoint[]> {
  const prompt = `
    Analyze the following backend JavaScript/TypeScript code.
    Extract all REST API endpoints with these details:
      - "method": HTTP method (GET, POST, PUT, PATCH, DELETE)
      - "endpoint": the route path (e.g., "/users")
      - "body" (optional): if the endpoint expects a request body (for POST, PUT, PATCH, get),
        provide realistic example data for each field instead of types. Use plausible values
        like names, emails, numbers, booleans, arrays, etc.

      
      - Strictly only consider the Endpoints from the code sent, do not add any other endpoints, consider only the request body asked in the endpoint do not add any extra fields.
      - in case of  code like:
          
     
app.get("/products/:id", (req, res) => {
  const { id } = req.params;

  return res.status(200)
  res.json(product);
}); where you do not have access to the database to enable provision of the right id, then have a look in the comments that has the user provided
any reference as //id->1 then us can use that id as a field to test that is make the url like /product/1 or else simply do not provide anything

    For example, if the code contains:
      app.post("/users", (req, res) => {
        const { name, age } = req.body;
      });

    The output should be:
    [
      { "method": "POST", "endpoint": "/users", "body": { "name": "Aditi", "age": 19 } }
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

  log("\n===  Extracted Endpoints with Realistic Data ===\n");
  log(text);

  // Remove code fences if present
  let cleanText = text.trim();
  cleanText = cleanText.replace(/```(?:json)?\n([\s\S]*?)```/, "$1").trim();

  try {
    const endpoints = JSON.parse(cleanText);
    log("Endpoints: once again" + JSON.stringify(endpoints, null, 2));

    if (!Array.isArray(endpoints)) throw new Error("Parsed JSON is not an array");

    return endpoints;
  } catch (err: any) {
    log("Failed to parse JSON from Gemini response:\n" + cleanText);
    log("Error: " + err.message);
    return [];
  }
}
