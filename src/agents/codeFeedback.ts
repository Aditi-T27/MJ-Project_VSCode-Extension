import { geminiModel } from "../utils/geminiClient.js";
import { log } from "../utils/logger.js";

// Define seed dataset as a constant array
const seedDataset = [
  {
    "method": "POST",
    "endpoint": "/users",
    "inputFields": ["name", "age", "email"],
    "possibleEdgeCases": [
      {"field": "name", "issue": "empty string"},
      {"field": "age", "issue": "string instead of number"},
      {"field": "name", "issue": "special characters"},
      {"field": "age", "issue": "negative value"},
      {"field": "body", "issue": "prototype pollution keys"}
    ],
    "suggestedImprovements": [
      "Validate that name is non-empty and sanitize input",
      "Ensure age is a number and within valid range",
      "Add rate limiting and helmet for security",
      "Reject prototype pollution keys",
      "Enforce JSON content-type and payload size limits"
    ]
  },
  {
    "method": "GET",
    "endpoint": "/products",
    "inputFields": ["category", "limit", "offset"],
    "possibleEdgeCases": [
      {"field": "limit", "issue": "non-integer value"},
      {"field": "offset", "issue": "negative value"},
      {"field": "category", "issue": "unsupported category string"}
    ],
    "suggestedImprovements": [
      "Validate pagination parameters as integers >= 0",
      "Validate category against allowlist",
      "Enforce defaults for missing pagination params"
    ]
  },
  ,
  {
    "method": "PUT",
    "endpoint": "/users/:id",
    "inputFields": ["id", "email", "phone"],
    "possibleEdgeCases": [
      {"field": "id", "issue": "missing or invalid format"},
      {"field": "email", "issue": "invalid email format"},
      {"field": "phone", "issue": "non-digit characters"}
    ],
    "suggestedImprovements": [
      "Validate user ID format",
      "Use strict email and phone validation",
      "Reject update if no recognized fields provided"
    ]
  },
  {
    "method": "DELETE",
    "endpoint": "/orders/:orderId",
    "inputFields": ["orderId"],
    "possibleEdgeCases": [
      {"field": "orderId", "issue": "non-existent ID"},
      {"field": "orderId", "issue": "malformed ID string"}
    ],
    "suggestedImprovements": [
      "Validate order ID format",
      "Check authorization before delete",
      "Return clear error for missing order"
    ]
  },
  {
    "method": "POST",
    "endpoint": "/login",
    "inputFields": ["username", "password"],
    "possibleEdgeCases": [
      {"field": "username", "issue": "empty string"},
      {"field": "password", "issue": "missing or too short"},
      {"field": "body", "issue": "large payload"}
    ],
    "suggestedImprovements": [
      "Enforce minimum password length",
      "Rate limit login attempts",
      "Require JSON content-type"
    ]
  },
  {
    "method": "PATCH",
    "endpoint": "/users/:id/preferences",
    "inputFields": ["id", "preferences"],
    "possibleEdgeCases": [
      {"field": "preferences.theme", "issue": "unsupported theme value"},
      {"field": "preferences.notifications", "issue": "non-boolean values"},
      {"field": "id", "issue": "invalid or missing user ID"}
    ],
    "suggestedImprovements": [
      "Validate input data types strictly",
      "Allow only known preference keys and values",
      "Reject payloads with prototype pollution keys"
    ]
  },
  {
    "method": "POST",
    "endpoint": "/feedback",
    "inputFields": ["userId", "comments", "rating"],
    "possibleEdgeCases": [
      {"field": "rating", "issue": "out of accepted range"},
      {"field": "comments", "issue": "empty or too long"},
      {"field": "userId", "issue": "missing or invalid format"}
    ],
    "suggestedImprovements": [
      "Enforce rating within min and max bounds",
      "Sanitize comments to prevent XSS",
      "Validate userId format strictly"
    ]
  },
  {
    "method": "GET",
    "endpoint": "/reports",
    "inputFields": ["startDate", "endDate", "type"],
    "possibleEdgeCases": [
      {"field": "startDate", "issue": "invalid date format"},
      {"field": "endDate", "issue": "earlier than startDate"},
      {"field": "type", "issue": "unsupported report type"}
    ],
    "suggestedImprovements": [
      "Validate date formats rigorously",
      "Ensure logical date ranges",
      "Validate type against allowlist"
    ]
  },
  {
    "method": "POST",
    "endpoint": "/files/upload",
    "inputFields": ["file"],
    "possibleEdgeCases": [
      {"field": "file", "issue": "missing file"},
      {"field": "file", "issue": "file too large"},
      {"field": "file", "issue": "unsupported file type"}
    ],
    "suggestedImprovements": [
      "Validate file existence and size limits",
      "Whitelist allowed file types",
      "Implement authentication and authorization"
    ]
  },
  {
    "method": "PUT",
    "endpoint": "/settings",
    "inputFields": ["settings"],
    "possibleEdgeCases": [
      {"field": "settings", "issue": "missing required keys"},
      {"field": "settings", "issue": "invalid nested values"},
      {"field": "body", "issue": "prototype pollution keys"}
    ],
    "suggestedImprovements": [
      "Validate required settings keys and types",
      "Reject prototype pollution keys",
      "Sanitize all input fields"
    ]
  }
];

export async function analyzeEdgeCases(code: string) {
  // Select a few seed examples as string for prompt few-shot
  const fewShots = JSON.stringify(seedDataset.slice(0, 3), null, 2);

  const prompt = `
You are a backend code reviewer. Analyze the following JavaScript/TypeScript backend code.

Here are some examples of analysis:

${fewShots}

Now analyze this backend code similarly, understand what the code does and provide a valuable feedback, specifically understand
what the fields and parameters are and provide insights on malicious test cases which the api code is not able handle, provide 3 such testcases for each endpoint: and answer as
how these cases can be handled.
Do not repeat the answers, apprach each endpoint with a fresh approach learn and provide the right and best fit suggestions
Backend code:
${code}
  `;

  const resp = await geminiModel.generateContent(prompt);
  const text = resp.response.text();

  log("\n=== LLM Feedback on Edge Cases ===\n");


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
















