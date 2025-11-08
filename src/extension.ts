// import * as vscode from "vscode";
// import { clearAndShow, log } from "./utils/logger.js";
// import { analyzeCode } from "./agents/codeAnalyzer.js";
// import { runTests } from "./agents/testRunner.js";
// import { generateDocs } from "./agents/docGenerator.js";
// import { analyzeEdgeCases } from "./agents/codeFeedback.js";
// import * as path from "path";
// import * as fs from "fs";

// export function createWebviewPanel(
//   context: vscode.ExtensionContext
// ): vscode.WebviewPanel {
//   const panel = vscode.window.createWebviewPanel(
//     "geminiEndpoints",
//     "Gemini API Endpoints",
//     vscode.ViewColumn.One,
//     {
//       enableScripts: true,
//       localResourceRoots: [
//         vscode.Uri.file(path.join(context.extensionPath, "frontend", "dist")),
//       ],
//     }
//   );

//   panel.webview.html = getWebviewContent(panel, context.extensionUri);
//   return panel;
// }

// function getWebviewContent(
//   panel: vscode.WebviewPanel,
//   extensionUri: vscode.Uri
// ): string {
//   const reactAppPath = path.join(extensionUri.fsPath, "frontend", "dist");
//   const indexPath = path.join(reactAppPath, "index.html");
//   let indexHtml = fs.readFileSync(indexPath, "utf8");

//   // Fix asset URIs for webview
//   indexHtml = indexHtml.replace(
//     /\/assets\//g,
//     panel.webview.asWebviewUri(
//       vscode.Uri.file(path.join(reactAppPath, "assets"))
//     ) + "/"
//   );

//   return indexHtml;
// }

// export function activate(context: vscode.ExtensionContext) {
//   const explainCmd = vscode.commands.registerCommand(
//     "gemini.explainCode",
//     async () => {
//       const editor = vscode.window.activeTextEditor;
//       if (!editor) {
//         vscode.window.showInformationMessage("Open a file to analyze");
//         return;
//       }

//       const code = editor.document.getText();
//       clearAndShow();
//       log("Sending code to Gemini...\n");

//       try {
//         const endpoints = await analyzeCode(code);
//         if (endpoints.length === 0) {
//           vscode.window.showErrorMessage("No endpoints extracted.");
//           return;
//         }

//         log("Endpoints:" + endpoints);

//         log("Running tests...");
//         await runTests(endpoints);

//         log("Generating docs...");
//         generateDocs(endpoints);

//         // Show React panel
//         log("Creating Webview...");
//         const panel = createWebviewPanel(context);

//         // This won’t affect React yet (until we add listeners)
//         log("Posting message to Webview...");
//         panel.webview.postMessage({
//           type: "setEndpoints",
//           // data: endpoints,
//           endpoints: endpoints
//         });

//         log("Message posted.");
//       } catch (err: any) {
//         log("Gemini call error: " + String(err));
//         vscode.window.showErrorMessage(
//           "Gemini request failed — see output channel"
//         );
//       }
//     }
//   );

//   const feedbackCmd = vscode.commands.registerCommand(
//     "gemini.feedbackCode",
//     async () => {
//       const editor = vscode.window.activeTextEditor;
//       if (!editor) {
//         vscode.window.showInformationMessage("Open a file to analyze");
//         return;
//       }

//       const code = editor.document.getText();
//       clearAndShow();
//       log("Sending code to Gemini for feedback...\n");

//       try {
//         const feedback = await analyzeEdgeCases(code);

//         if (feedback.length === 0) {
//           vscode.window.showErrorMessage("No feedback generated.");
//           return;
//         }

//         log("\n=== Edge Case Feedback ===\n");
//         log(JSON.stringify(feedback, null, 2));
//       } catch (err: any) {
//         log("Gemini feedback error: " + String(err));
//         vscode.window.showErrorMessage(
//           "Gemini feedback request failed — see output channel"
//         );
//       }
//     }
//   );

//   context.subscriptions.push(explainCmd, feedbackCmd);
// }

// export function deactivate() {}

// // import * as vscode from "vscode";
// // import { clearAndShow, log } from "./utils/logger.js";
// // import { analyzeCode } from "./agents/codeAnalyzer.js";
// // import { runTests } from "./agents/testRunner.js";
// // import { generateDocs } from "./agents/docGenerator.js";
// // import { analyzeEdgeCases } from "./agents/codeFeedback.js";
// // import * as path from "path";
// // import * as fs from "fs";

// // export function createWebviewPanel(
// //   context: vscode.ExtensionContext
// // ): vscode.WebviewPanel {
// //   const panel = vscode.window.createWebviewPanel(
// //     "geminiEndpoints",
// //     "Gemini API Endpoints",
// //     vscode.ViewColumn.One,
// //     {
// //       enableScripts: true,
// //       localResourceRoots: [
// //         vscode.Uri.file(path.join(context.extensionPath, "frontend", "dist")),
// //       ],
// //     }
// //   );

// //   panel.webview.html = getWebviewContent(panel, context.extensionUri);
  
// //   // Set up message listener for webview communications
// //   panel.webview.onDidReceiveMessage(
// //     message => {
// //       switch (message.command) {
// //         case 'generateDocs':
// //           // Handle documentation generation
// //           log('Generating documentation...');
// //           // You can call generateDocs here if needed
// //           break;
// //         case 'analyzeFeedback':
// //           // Handle feedback analysis
// //           log('Analyzing feedback...');
// //           // You can call analyzeEdgeCases here if needed
// //           break;
// //       }
// //     },
// //     undefined,
// //     context.subscriptions
// //   );

// //   return panel;
// // }

// // function getWebviewContent(
// //   panel: vscode.WebviewPanel,
// //   extensionUri: vscode.Uri
// // ): string {
// //   const reactAppPath = path.join(extensionUri.fsPath, "frontend", "dist");
// //   const indexPath = path.join(reactAppPath, "index.html");
// //   let indexHtml = fs.readFileSync(indexPath, "utf8");

// //   // Fix asset URIs for webview
// //   indexHtml = indexHtml.replace(
// //     /\/assets\//g,
// //     panel.webview.asWebviewUri(
// //       vscode.Uri.file(path.join(reactAppPath, "assets"))
// //     ) + "/"
// //   );

// //   return indexHtml;
// // }

// // export function activate(context: vscode.ExtensionContext) {
// //   const explainCmd = vscode.commands.registerCommand(
// //     "gemini.explainCode",
// //     async () => {
// //       const editor = vscode.window.activeTextEditor;
// //       if (!editor) {
// //         vscode.window.showInformationMessage("Open a file to analyze");
// //         return;
// //       }

// //       const code = editor.document.getText();
// //       clearAndShow();
// //       log("Sending code to Gemini...\n");

// //       try {
// //         const endpoints = await analyzeCode(code);
// //         if (endpoints.length === 0) {
// //           vscode.window.showErrorMessage("No endpoints extracted.");
// //           return;
// //         }

// //         log("Endpoints:" + JSON.stringify(endpoints, null, 2));

// //         // Show React panel first
// //         log("Creating Webview...");
// //         const panel = createWebviewPanel(context);

// //         // Run tests and get results
// //         log("Running tests...");
// //         const testResults = await runTests(endpoints);

// //         // Send the actual test results to React
// //         log("Posting test results to Webview...");
// //         panel.webview.postMessage({
// //           type: "setEndpoints",
// //           endpoints: testResults
// //         });

// //         log("Generating docs...");
// //         generateDocs(endpoints);

// //         log("Test results sent to webview.");
// //       } catch (err: any) {
// //         log("Gemini call error: " + String(err));
// //         vscode.window.showErrorMessage(
// //           "Gemini request failed — see output channel"
// //         );
// //       }
// //     }
// //   );

// //   const feedbackCmd = vscode.commands.registerCommand(
// //     "gemini.feedbackCode",
// //     async () => {
// //       const editor = vscode.window.activeTextEditor;
// //       if (!editor) {
// //         vscode.window.showInformationMessage("Open a file to analyze");
// //         return;
// //       }

// //       const code = editor.document.getText();
// //       clearAndShow();
// //       log("Sending code to Gemini for feedback...\n");

// //       try {
// //         const feedback = await analyzeEdgeCases(code);

// //         if (feedback.length === 0) {
// //           vscode.window.showErrorMessage("No feedback generated.");
// //           return;
// //         }

// //         log("\n=== Edge Case Feedback ===\n");
// //         log(JSON.stringify(feedback, null, 2));
// //       } catch (err: any) {
// //         log("Gemini feedback error: " + String(err));
// //         vscode.window.showErrorMessage(
// //           "Gemini feedback request failed — see output channel"
// //         );
// //       }
// //     }
// //   );

// //   context.subscriptions.push(explainCmd, feedbackCmd);
// // }

// // export function deactivate() {}



import * as vscode from "vscode";
import { clearAndShow, log } from "./utils/logger.js";
import { analyzeCode } from "./agents/codeAnalyzer.js";
import { runTests } from "./agents/testRunner.js";
import { generateApiDocsFromCode,  saveDocumentationToFile } from "./agents/docGenerator.js";
import { analyzeEdgeCases } from "./agents/codeFeedback.js";
import * as path from "path";
import * as fs from "fs";

export function createWebviewPanel(
  context: vscode.ExtensionContext
): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    "geminiEndpoints",
    "Gemini API Endpoints",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "frontend", "dist")),
      ],
    }
  );

  panel.webview.html = getWebviewContent(panel, context.extensionUri);

  return panel;
}

function getWebviewContent(
  panel: vscode.WebviewPanel,
  extensionUri: vscode.Uri
): string {
  const reactAppPath = path.join(extensionUri.fsPath, "frontend", "dist");
  const indexPath = path.join(reactAppPath, "index.html");
  let indexHtml = fs.readFileSync(indexPath, "utf8");

  // Fix asset URIs for webview
  indexHtml = indexHtml.replace(
    /\/assets\//g,
    panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(reactAppPath, "assets"))
    ) + "/"
  );

  return indexHtml;
}

export function activate(context: vscode.ExtensionContext) {
  const explainCmd = vscode.commands.registerCommand(
    "gemini.explainCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Open a file to analyze");
        return;
      }

      const code = editor.document.getText();
      clearAndShow();
      log("Evaluating Code for API endpoint extraction and auto-field addition\n");

      try {
        // Analyze code to extract endpoints
        const endpoints = await analyzeCode(code);
        if (endpoints.length === 0) {
          vscode.window.showErrorMessage("No endpoints extracted.");
          return;
        }

        log("Endpoints:" + JSON.stringify(endpoints, null, 2));

        // Run tests on the endpoints
        log("Running tests...");
        let testResults: any[] = [];
        try {
          testResults = await runTests(endpoints);
          log("Test results:");
          log(JSON.stringify(testResults, null, 2));
        } catch (err: any) {
          log("Error running tests: " + String(err));
        }

        // Generate docs
        // log("Generating docs...");
        // generateDocs(endpoints);

        // Create React Webview
        log("Creating Webview...");
        const panel = createWebviewPanel(context);

        // Send endpoints + test results when React is ready
        const handleMessage = panel.webview.onDidReceiveMessage((message) => {
          if (message.type === "reactReady") {
            log("React ready — sending endpoints and test results");
            panel.webview.postMessage({
              type: "setEndpoints",
              endpoints: endpoints,
              testResults: testResults, // <-- new field
            });
          }
        });

        // Clean up when panel is closed
        panel.onDidDispose(() => handleMessage.dispose());

      } catch (err: any) {
        log("Gemini call error: " + String(err));
        vscode.window.showErrorMessage(
          "Gemini request failed — see output channel"
        );
      }
    }
  );

  const feedbackCmd = vscode.commands.registerCommand(
    "gemini.feedbackCode",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Open a file to analyze");
        return;
      }

      const code = editor.document.getText();
      clearAndShow();
      log("Sending code for feedback...\n");

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
        vscode.window.showErrorMessage(
          "Gemini feedback request failed — see output channel"
        );
      }
    }
  );

  //extension.ts 
  const docGenCmd = vscode.commands.registerCommand("gemini.generateApiDocs", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("Please open a file containing API code.");
      return;
    }

    const code = editor.document.getText();

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Generating API documentation...",
        cancellable: false,
      },
      async () => {
        try {
          const markdown = await generateApiDocsFromCode(code);
          await saveDocumentationToFile(markdown);
          
        } catch (err: any) {
          vscode.window.showErrorMessage("Documentation generation failed: " + err.message);
        }
      }
    );
  });

  context.subscriptions.push(explainCmd, feedbackCmd, docGenCmd);



  // context.subscriptions.push(explainCmd, feedbackCmd);
}


export function deactivate() {}
