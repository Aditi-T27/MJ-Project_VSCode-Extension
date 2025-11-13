// // import { AnalysisResult, Endpoint } from "../utils/types.js";
// // import { log } from "../utils/logger.js";

// // export function generateDocs(endpoints: Endpoint[]) {
// //   log("\n=== Documentation ===\n");
// //   endpoints.forEach((ep) => {
// //     log(`- **${ep.method}** ${ep.endpoint}`);
// //   });
// // }

// import * as vscode from "vscode";
// import OpenAI from "openai";
// import * as fs from "fs";
// import * as path from "path";
// import * as dotenv from "dotenv";

// dotenv.config();

// // const HF_TOKEN = process.env.HF_TOKEN;

// const HF_TOKEN= "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"; 
// if (!HF_TOKEN) {
//   throw new Error("HF_TOKEN is missing. Please set it in your .env file");
// }

// // Create OpenAI-compatible Hugging Face client
// const client = new OpenAI({
//   baseURL: "https://router.huggingface.co/v1",
//   apiKey: HF_TOKEN,
// });

// /**
//  * Builds the LLM prompt for generating full API documentation
//  */
// function buildPrompt(code: string): string {
//   return `
// You are an expert technical writer generating API documentation for backend developers.

// Analyze the provided Express.js or Node.js backend source code.
// The code may include multiple route handlers (GET, POST, PUT, DELETE, etc.). 
// Generate detailed, well-structured Markdown documentation covering **all endpoints** found in the code.

// Follow this structure strictly for each endpoint:

// ---

// ### \`${"{METHOD}"}\` ${"{PATH}"}

// [Provide a brief summary of what the endpoint does.]

// **Parameters**

// | Name | Type | Location | Description |
// |------|------|-----------|--------------|
// [List parameters if any, otherwise omit this section]

// **Request Body**

// [Describe expected JSON body (if any) with a code block example.]

// **Responses**

// <details>
// <summary><code>200 OK</code> - Successful Response</summary>

// \`\`\`json
// {
//   "example": "response"
// }
// \`\`\`
// </details>

// <details>
// <summary><code>400 Bad Request</code> - Error</summary>

// \`\`\`json
// {
//   "error": "Invalid input"
// }
// \`\`\`
// </details>

// **Permissions**

// [List inferred permissions or note “Public endpoint.”]

// ---

// Now generate complete markdown documentation for the following backend source code:

// \`\`\`javascript
// ${code}
// \`\`\`
// `;
// }

// /**
//  * Generate API documentation for a full source file.
//  */
// export async function generateApiDocsFromCode(code: string|null|undefined): Promise<string> {

//     if (!code || code.trim().length === 0) {
//         console.warn("No code provided to generateApiDocsFromCode");
//         return "# API Documentation\n\n_No valid code available for documentation generation._";
//     }

//     const prompt = buildPrompt(code);

//   try {
//     const chatCompletion = await client.chat.completions.create({
//       model: "meta-llama/Llama-3.1-8B-Instruct",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are a professional API documentation generator that writes clean, developer-friendly markdown.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       temperature: 0.3,
//       max_tokens: 1200,
//     });

//     const markdown = chatCompletion.choices[0]?.message?.content || "";
//     return markdown.trim();
//   } catch (error: any) {
//     console.error("Hugging Face LLM error:", error.response?.data || error.message);
//     throw new Error("Failed to generate documentation.");
//   }
// }

// /**
//  * Save the generated documentation to a markdown file in the workspace.
//  */
// export async function saveDocumentationToFile(content: string, fileName = "API_Documentation.md") {
//   if (!vscode.workspace.workspaceFolders) {
//     vscode.window.showErrorMessage("No workspace folder open to save the documentation.");
//     return;
//   }

//   const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
//   const outputPath = path.join(workspacePath, `${fileName}_${timestamp}.md`);

//   fs.writeFileSync(outputPath, content, "utf-8");
//   vscode.window.showInformationMessage(`📘 Documentation saved as ${fileName}`);

//   return outputPath;
// }




import * as vscode from "vscode";
import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN || "";
if (!HF_TOKEN) {
  vscode.window.showErrorMessage("HF_TOKEN missing. Add it in your .env file.");
  throw new Error("HF_TOKEN is missing. Please set it in your .env file");
}

// Create Hugging Face client compatible with OpenAI format
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: HF_TOKEN,
});

/**
 * Builds the LLM prompt for generating Markdown documentation.
 */
function buildPrompt(code: string): string {
  return `
You are an expert technical writer generating API documentation for backend developers.

Analyze the provided Express.js or Node.js backend code and produce **clean, professional Markdown documentation**
for all endpoints (GET, POST, PUT, DELETE, etc.) found in the code.

Format for each endpoint:

---

### \`${"{METHOD}"}\` ${"{PATH}"}

[Brief summary]

**Parameters**
| Name | Type | Location | Description |
|------|------|-----------|--------------|
[List parameters or omit if none]

**Request Body**
\`\`\`json
{ "example": "body" }
\`\`\`

**Responses**
<details>
<summary><code>200 OK</code></summary>
\`\`\`json
{ "example": "response" }
\`\`\`
</details>

**Permissions**
[Inferred or “Public endpoint.”]

---

Now generate Markdown documentation for this backend code:
\`\`\`javascript
${code}
\`\`\`
`;
}

/**
 * Generate API documentation for backend code using Hugging Face LLM.
 */
export async function generateApiDocsFromCode(code: string | null | undefined): Promise<string> {
  if (!code || code.trim().length === 0) {
    console.warn("No code provided to generateApiDocsFromCode");
    return "# API Documentation\n\n_No valid code provided._";
  }

  const prompt = buildPrompt(code);
  const model = "HuggingFaceH4/zephyr-7b-beta"; // ✅ stable chat model

  try {
    console.log("🔹 Sending prompt to Hugging Face model:", model);

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a professional API documentation generator that produces clear, accurate Markdown output.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const markdown = response.choices?.[0]?.message?.content?.trim();
    if (!markdown) throw new Error("Empty response from the model.");

    console.log("✅ Documentation generated successfully");
    return markdown;
  } catch (error: any) {
    const errMsg =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Unknown error while generating docs.";

    console.error("❌ Hugging Face LLM error:", errMsg);
    vscode.window.showErrorMessage(`Failed to generate docs: ${errMsg}`);
    return "# API Documentation\n\n_Failed to generate documentation due to API error._";
  }
}

/**
 * Save generated documentation to a Markdown file in the workspace.
 */
export async function saveDocumentationToFile(
  content: string,
  fileName = "API_Documentation.md"
) {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folder open to save documentation.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const outputPath = path.join(workspacePath, `${fileName}_${timestamp}.md`);

  try {
    fs.writeFileSync(outputPath, content, "utf-8");
    vscode.window.showInformationMessage(`📘 Documentation saved: ${path.basename(outputPath)}`);
    return outputPath;
  } catch (err: any) {
    vscode.window.showErrorMessage(`Failed to save documentation: ${err.message}`);
  }
}
