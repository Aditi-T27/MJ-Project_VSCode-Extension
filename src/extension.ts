import * as vscode from "vscode";
import { clearAndShow, log } from "./utils/logger.js";
import { analyzeCode } from "./agents/codeAnalyzer.js";
import { runTests } from "./agents/testRunner.js";
import { generateDocs } from "./agents/docGenerator.js";
import { analyzeEdgeCases } from "./agents/codeFeedback.js";

export function activate(context: vscode.ExtensionContext) {
  // Command 1: Normal flow
  const explainCmd = vscode.commands.registerCommand("gemini.explainCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("Open a file to analyze");
      return;
    }

    const code = editor.document.getText();
    clearAndShow();
    log("Sending code to Gemini...\n");

    try {
      const endpoints = await analyzeCode(code);

      if (endpoints.length === 0) {
        vscode.window.showErrorMessage("No endpoints extracted.");
        return;
      }

      await runTests(endpoints);
      generateDocs(endpoints);

    } catch (err: any) {
      log("Gemini call error: " + String(err));
      vscode.window.showErrorMessage("Gemini request failed — see output channel");
    }
  });

  // Command 2: Feedback mode
  const feedbackCmd = vscode.commands.registerCommand("gemini.feedbackCode", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("Open a file to analyze");
      return;
    }

    const code = editor.document.getText();
    clearAndShow();
    log("Sending code to Gemini for feedback...\n");

    try {
      const feedback = await analyzeEdgeCases(code);

      if (feedback.length === 0) {
        vscode.window.showErrorMessage("No feedback generated.");
        return;
      }

      log("\n=== Edge Case Feedback ===\n");
      log(JSON.stringify(feedback, null, 2));

    } catch (err: any) {
      log("Gemini feedback error: " + String(err));
      vscode.window.showErrorMessage("Gemini feedback request failed — see output channel");
    }
  });

  context.subscriptions.push(explainCmd, feedbackCmd);
}

export function deactivate() {}



//-- The  below code does not have the second cmd of check and feedback

// import * as vscode from "vscode";
// import { clearAndShow, log } from "./utils/logger.js";
// import { analyzeCode } from "./agents/codeAnalyzer.js";
// import { runTests } from "./agents/testRunner.js";
// import { generateDocs } from "./agents/docGenerator.js";

// export function activate(context: vscode.ExtensionContext) {
//   const explainCmd = vscode.commands.registerCommand("gemini.explainCode", async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showInformationMessage("Open a file to analyze");
//       return;
//     }

//     const code = editor.document.getText();
//     clearAndShow();
//     log("Sending code to Gemini...\n");

//     try {
//       // Agent 1: Analyze code
//       const endpoints = await analyzeCode(code);

//       if (endpoints.length === 0) {
//         vscode.window.showErrorMessage("No endpoints extracted.");
//         return;
//       }

//       // Agent 2: Run tests
//       await runTests(endpoints);

//       // Agent 3: Generate documentation
//       generateDocs(endpoints);

//     } catch (err: any) {
//       log("Gemini call error: " + String(err));
//       vscode.window.showErrorMessage("Gemini request failed — see Gemini output channel");
//     }
//   });

//   context.subscriptions.push(explainCmd);
// }

// export function deactivate() {}


















//Extra code to  be commented, added by admin

// import * as vscode from 'vscode';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import * as dotenv from 'dotenv';
// import fetch from 'node-fetch'; // or use global fetch in Node 18+

// dotenv.config();

// let ai: any;

// export function activate(context: vscode.ExtensionContext) {
  
//   ai = new GoogleGenerativeAI( process.env.GEMINI_API_KEY || "");

//   const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const output = vscode.window.createOutputChannel('Gemini');

//   const explainCmd = vscode.commands.registerCommand('gemini.explainCode', async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showInformationMessage('Open a file to extract and test API endpoints');
//       return;
//     }

//     const code = editor.document.getText();
//     output.clear();
//     output.show(true);
//     output.appendLine('Sending code to Gemini (truncated preview):\n');
//     output.appendLine(code.slice(0, 1500) + (code.length > 1500 ? '\n\n...[truncated]' : ''));

//     try {
//       const prompt = `
//         Extract all REST API endpoints from the following JavaScript/TypeScript code.
//         Return ONLY a JSON array of objects like:
//         [
//           { "method": "GET", "endpoint": "/users" },
//           { "method": "POST", "endpoint": "/login" }
//         ]
        
//         Code:
//         ${code}
//       `;

//       const resp = await model.generateContent(prompt);

//       // Gemini response can vary, try candidates[0].content first
//       // const text = resp?.text ?? resp?.candidates?.[0]?.content ?? JSON.stringify(resp);
//       const text = resp.response.text();
//       output.appendLine('\n=== Gemini Extracted Endpoints ===\n');
//       output.appendLine(text);

//       let cleanText = text.trim();

//       // Remove ```json ... ``` or ``` ... ``` fences
//       cleanText = cleanText.replace(/```(?:json)?\n([\s\S]*?)```/, '$1').trim();

//       let endpoints: { method: string; endpoint: string }[] = [];
//       try {
//         endpoints = JSON.parse(cleanText);
//         if (!Array.isArray(endpoints)) {
//           throw new Error('Parsed JSON is not an array');
//         }
//       } catch (err) {
//         output.appendLine('Failed to parse JSON from Gemini response. Response:\n' + cleanText);
//         vscode.window.showErrorMessage('Failed to parse endpoints from Gemini response. Check output panel.');
//         return;
//       }

//       // Run basic GET requests
//       output.appendLine('\n=== Running Basic GET Tests ===\n');
//       for (const ep of endpoints) {
//         try {
//           if (ep.method.toUpperCase() !== 'GET') {
//             continue;
//           }
//           const url = `http://localhost:3000${ep.endpoint}`;
//           const res = await fetch(url);
//           output.appendLine(`GET ${url} -> ${res.status}`);
//         } catch (err) {
//           output.appendLine(`GET ${ep.endpoint} -> ERROR: ${(err as Error).message}`);
//         }
//       }

//     } catch (err) {
//       output.appendLine('Gemini call error: ' + String(err));
//       vscode.window.showErrorMessage('Gemini request failed — see Gemini output channel');
//     }
//   });

//   context.subscriptions.push(explainCmd);
// }

// export function deactivate() {}

