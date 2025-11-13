


import * as vscode from "vscode";
import { clearAndShow, log } from "./utils/logger.js";
import { analyzeCode } from "./agents/codeAnalyzer.js";
import { runTests } from "./agents/testRunner.js";
import { generateApiDocsFromCode, saveDocumentationToFile } from "./agents/docGenerator.js";
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

  indexHtml = indexHtml.replace(
    /\/assets\//g,
    panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(reactAppPath, "assets"))
    ) + "/"
  );

  return indexHtml;
}

// let lastAnalyzedFile: string | null = null;

// // 🔹 [Added for UI feedback trigger]
// let globalPanel: vscode.WebviewPanel | null = null;

// export function activate(context: vscode.ExtensionContext) {
//   vscode.workspace.onDidOpenTextDocument((doc) => {
//     lastAnalyzedFile = doc.uri.fsPath;
//   });

//   // 🔹 [Added for UI feedback trigger]
//   function getOrCreatePanel(): vscode.WebviewPanel {
//     if (globalPanel) {
//       globalPanel.reveal(vscode.ViewColumn.Beside);
//       return globalPanel;
//     }

//     const panel = createWebviewPanel(context);
//     globalPanel = panel;

//     // Handle global messages (from React)
//     panel.webview.onDidReceiveMessage(async (message) => {
//       log("📨 Message from React: " + JSON.stringify(message));

//       if (message.type === "runCommand" && message.command) {
//         log(`⚙️ Running command: ${message.command}`);
//         await vscode.commands.executeCommand(message.command);
//       }
//     });

//     panel.onDidDispose(() => {
//       globalPanel = null;
//     });

//     return panel;
//   }

//   const explainCmd = vscode.commands.registerCommand("gemini.explainCode", async () => {
//     let code: string | null = null;
//     let filePath: string | null = null;

//     const editor = vscode.window.activeTextEditor;
//     if (editor) {
//       code = editor.document.getText();
//       filePath = editor.document.uri.fsPath;
//       lastAnalyzedFile = filePath;
//     } else if (lastAnalyzedFile) {
//       const doc = await vscode.workspace.openTextDocument(lastAnalyzedFile);
//       code = doc.getText();
//       filePath = lastAnalyzedFile;
//     }

//     if (!code) {
//       vscode.window.showInformationMessage("Open a file to analyze");
//       return;
//     }

//     clearAndShow();
//     log("Evaluating Code for API endpoint extraction and auto-field addition\n");

//     try {
//       const endpoints = await analyzeCode(code);
//       if (endpoints.length === 0) {
//         vscode.window.showErrorMessage("No endpoints extracted.");
//         return;
//       }

//       log("Endpoints:" + JSON.stringify(endpoints, null, 2));

//       log("Running tests...");
//       let testResults: any[] = [];
//       try {
//         testResults = await runTests(endpoints);
//         log("Test results:");
//         log(JSON.stringify(testResults, null, 2));
//       } catch (err: any) {
//         log("Error running tests: " + String(err));
//       }

//       log("Creating Webview...");
//       const panel = getOrCreatePanel();

//       const handleMessage = panel.webview.onDidReceiveMessage((message) => {
//         if (message.type === "reactReady") {
//           log("React ready — sending endpoints and test results");
//           panel.webview.postMessage({
//             type: "setEndpoints",
//             endpoints: endpoints,
//             testResults: testResults,
//           });
//         }
//       });

//       panel.onDidDispose(() => handleMessage.dispose());
//     } catch (err: any) {
//       log("Gemini call error: " + String(err));
//       vscode.window.showErrorMessage("Gemini request failed — see output channel");
//     }
//   });

//   const feedbackCmd = vscode.commands.registerCommand("gemini.feedbackCode", async () => {
//     let code: string | null = null;
//     let filePath: string | null = null;

//     const editor = vscode.window.activeTextEditor;
//     if (editor) {
//       code = editor.document.getText();
//       filePath = editor.document.uri.fsPath;
//       lastAnalyzedFile = filePath;
//     } else if (lastAnalyzedFile) {
//       const doc = await vscode.workspace.openTextDocument(lastAnalyzedFile);
//       code = doc.getText();
//       filePath = lastAnalyzedFile;
//     }

//     if (!code) {
//       vscode.window.showInformationMessage("No file found to analyze");
//       return;
//     }

//     clearAndShow();
//     log("Sending code for feedback...\n");

//     try {
//       const feedback = await analyzeEdgeCases(code);

//       if (!feedback || feedback.length === 0) {
//         vscode.window.showErrorMessage("No feedback generated.");
//         return;
//       }

//       log("\n=== Edge Case Feedback ===\n");
//       log(JSON.stringify(feedback, null, 2));

//       log("Creating Webview...");
//       const panel = getOrCreatePanel();

//       const handleMessage = panel.webview.onDidReceiveMessage(async (message) => {
//         switch (message.type) {
//           case "reactReady":
//             log("React ready — sending feedback results");
//             panel.webview.postMessage({
//               type: "setFeedback",
//               feedbackResults: feedback,
//             });
//             break;
//         }
//       });

//       panel.onDidDispose(() => handleMessage.dispose());
//     } catch (err: any) {
//       log("Gemini feedback error: " + String(err));
//       vscode.window.showErrorMessage("Gemini feedback request failed — see output channel");
//     }
//   });

//   const docGenCmd = vscode.commands.registerCommand("gemini.generateApiDocs", async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showErrorMessage("Please open a file containing API code.");
//       return;
//     }

//     const code = editor.document.getText();

//     vscode.window.withProgress(
//       {
//         location: vscode.ProgressLocation.Notification,
//         title: "Generating API documentation...",
//         cancellable: false,
//       },
//       async () => {
//         try {
//           const markdown = await generateApiDocsFromCode(code);
//           await saveDocumentationToFile(markdown);
//         } catch (err: any) {
//           vscode.window.showErrorMessage("Documentation generation failed: " + err.message);
//         }
//       }
//     );
//   });

//   const statusBarItem = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Right,
//     1000
//   );
//   statusBarItem.text = '$(file-code) Explain Code';
//   statusBarItem.tooltip = 'Click to run Explain Code';
//   statusBarItem.command = 'gemini.explainCode'; // triggers your existing command
//   statusBarItem.show();

//   // context.subscriptions.push(statusBarItem);

//    context.subscriptions.push(
//     explainCmd,
//     feedbackCmd,
//     docGenCmd,
//     statusBarItem
//   );
// }


let lastAnalyzedFile: string | null = null;
let lastAnalyzedCode: string | null = null; // 🔹 [NEW: store the code too]

//  [Added for UI feedback trigger]
let globalPanel: vscode.WebviewPanel | null = null;

export function activate(context: vscode.ExtensionContext) {
  vscode.workspace.onDidOpenTextDocument((doc) => {
    lastAnalyzedFile = doc.uri.fsPath;
  });

  function getOrCreatePanel(): vscode.WebviewPanel {
    if (globalPanel) {
      globalPanel.reveal(vscode.ViewColumn.Beside);
      return globalPanel;
    }

    const panel = createWebviewPanel(context);
    globalPanel = panel;

    //----- Handle global messages (from React) this is the prior cmd when only feedback btn exisited
    // panel.webview.onDidReceiveMessage(async (message) => {
    //   log(" Message from React: " + JSON.stringify(message));

    //   if (message.type === "runCommand" && message.command) {
    //     log(` Running command: ${message.command}`);
    //     // Pass file path info when invoking commands
    //     await vscode.commands.executeCommand(message.command, {
    //       filePath: lastAnalyzedFile,
    //       code: lastAnalyzedCode,
    //     });
    //   }
    // });

    panel.webview.onDidReceiveMessage(async (message) => {
  log("Message from React: " + JSON.stringify(message));

  if (message.type === "runCommand" && message.command) {
    log(`Running command: ${message.command}`);

    // Common data you may want to pass to every command
    const contextData = {
      filePath: lastAnalyzedFile,
      code: lastAnalyzedCode,
    };

    try {
      switch (message.command) {
        

        default:
          // For any other commands, just execute them normally
          await vscode.commands.executeCommand(message.command, contextData);
          break;
      }
    } catch (error) {
      log(`Error running command ${message.command}: ${error}`);
      vscode.window.showErrorMessage(
        `Error executing command ${message.command}: ${error}`
      );
    }
  }
});


    panel.onDidDispose(() => {
      globalPanel = null;
    });

    return panel;
  }

  // -------------------------------------------
  // EXPLAIN CODE COMMAND
  // -------------------------------------------
  const explainCmd = vscode.commands.registerCommand("gemini.explainCode", async () => {
    let code: string | null = null;
    let filePath: string | null = null;

    const editor = vscode.window.activeTextEditor;
    if (editor) {
      code = editor.document.getText();
      filePath = editor.document.uri.fsPath;
      lastAnalyzedFile = filePath;
      lastAnalyzedCode = code; // Save globally
    } else if (lastAnalyzedFile) {
      const doc = await vscode.workspace.openTextDocument(lastAnalyzedFile);
      code = doc.getText();
      filePath = lastAnalyzedFile;
      lastAnalyzedCode = code;
    }

    if (!code) {
      vscode.window.showInformationMessage("Open a file to analyze");
      return;
    }

    clearAndShow();
    log("Evaluating Code for API endpoint extraction and auto-field addition\n");

    try {
      const endpoints = await analyzeCode(code);
      if (endpoints.length === 0) {
        vscode.window.showErrorMessage("No endpoints extracted.");
        return;
      }

      log("Endpoints:" + JSON.stringify(endpoints, null, 2));

      log("Running tests...");
      let testResults: any[] = [];
      try {
        testResults = await runTests(endpoints);
        log("Test results:");
        log(JSON.stringify(testResults, null, 2));
      } catch (err: any) {
        log("Error running tests: " + String(err));
      }

      log("Creating Webview...");
      const panel = getOrCreatePanel();

      const handleMessage = panel.webview.onDidReceiveMessage((message) => {
        if (message.type === "reactReady") {
          log("React ready — sending endpoints and test results");
          panel.webview.postMessage({
            type: "setEndpoints",
            endpoints: endpoints,
            testResults: testResults,
          });
        }
      });

      panel.onDidDispose(() => handleMessage.dispose());
    } catch (err: any) {
      log("Gemini call error: " + String(err));
      vscode.window.showErrorMessage("Gemini request failed — see output channel");
    }
  });

  // -------------------------------------------
  // FEEDBACK COMMAND (Now reuses last file/code)
  // -------------------------------------------
  const feedbackCmd = vscode.commands.registerCommand(
    "gemini.feedbackCode",
    async (args?: { filePath?: string; code?: string }) => {
      // Prefer args passed from React
      let filePath = args?.filePath || lastAnalyzedFile;
      let code = args?.code || lastAnalyzedCode;

      if (!code && filePath) {
        const doc = await vscode.workspace.openTextDocument(filePath);
        code = doc.getText();
      }

      if (!code) {
        vscode.window.showInformationMessage("No file found to analyze");
        return;
      }

      clearAndShow();
      log("Sending code for feedback...\n");

      try {
        const feedback = await analyzeEdgeCases(code);

        if (!feedback || feedback.length === 0) {
          vscode.window.showErrorMessage("No feedback generated.");
          return;
        }

        log("\n=== Edge Case Feedback ===\n");
        log(JSON.stringify(feedback, null, 2));

        log("Creating Webview...");
       const panel = getOrCreatePanel();

// const handleMessage = panel.webview.onDidReceiveMessage(async (message) => {
//   if (message.type === "reactReady") {
//     log("React ready — sending feedback results now...");
//     await panel.webview.postMessage({
//       type: "setFeedback",
//       feedbackResults: feedback,
//     });
//   }
// });


log("Sending feedback to webview (panel already active)...");
log(feedback);
panel.webview.postMessage({
  type: "setFeedback",
  feedbackResults: feedback,
});
log(feedback);

// panel.onDidDispose(() => handleMessage.dispose());



      } catch (err: any) {
        log("Gemini feedback error: " + String(err));
        vscode.window.showErrorMessage("Gemini feedback request failed — see output channel");
      }
    }
  );

  // -------------------------------------------
  // DOC GENERATION COMMAND
  // -------------------------------------------
  const docGenCmd = vscode.commands.registerCommand("gemini.generateApiDocs",  async (args?: { filePath?: string; code?: string }) => {
      // Prefer args passed from React
      let filePath = args?.filePath || lastAnalyzedFile;
      let code = args?.code || lastAnalyzedCode;

      if (!code && filePath) {
        const doc = await vscode.workspace.openTextDocument(filePath);
        code = doc.getText();
      }

      if (!code) {
        vscode.window.showInformationMessage("No file found to analyze");
        return;
      }


    // const code = editor.document.getText();

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

  // -------------------------------------------
  // STATUS BAR SHORTCUT- currently functionality is not added 
  // -------------------------------------------
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
  statusBarItem.text = '$(file-code) Explain Code';
  statusBarItem.tooltip = 'Click to run Explain Code';
  statusBarItem.command = 'gemini.explainCode';
  statusBarItem.show();

  context.subscriptions.push(explainCmd, feedbackCmd, docGenCmd, statusBarItem);
}

export function deactivate() {}






// Working----
// import * as vscode from "vscode";
// import { clearAndShow, log } from "./utils/logger.js";
// import { analyzeCode } from "./agents/codeAnalyzer.js";
// import { runTests } from "./agents/testRunner.js";
// import { generateApiDocsFromCode,  saveDocumentationToFile } from "./agents/docGenerator.js";
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


// // export function activate(context: vscode.ExtensionContext) {
// //   let currentPanel: vscode.WebviewPanel | null = null;

// //   //  global webview message listener
// //   vscode.window.onDidChangeActiveTextEditor((editor) => {
// //     // this is just for debugging
// //     if (editor) log(`Active editor: ${editor.document.uri.fsPath}`);
// //   });

// //   // helper to create or reuse panel
// //   function getOrCreatePanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
// //     if (currentPanel) {
// //       currentPanel.reveal(vscode.ViewColumn.Beside);
// //       return currentPanel;
// //     }

// //     const panel = createWebviewPanel(context);
// //     currentPanel = panel;

// //     // attach listener once, globally
// //     panel.webview.onDidReceiveMessage(async (message) => {
// //       log("Received message from React: " + JSON.stringify(message));

// //       switch (message.type) {
// //         case "runCommand":
// //           if (message.command) {
// //             log(`Running VS Code command: ${message.command}`);
// //             await vscode.commands.executeCommand(message.command);
// //           }
// //           break;
// //       }
// //     });

// //     // cleanup
// //     panel.onDidDispose(() => {
// //       currentPanel = null;
// //     });

// //     return panel;
// //   }

// //   // now in your commands, replace `createWebviewPanel(context)` with:
// //   // const panel = getOrCreatePanel(context);

// //   const explainCmd = vscode.commands.registerCommand("gemini.explainCode", async () => {
// //     const editor = vscode.window.activeTextEditor;
// //     if (!editor) return vscode.window.showInformationMessage("Open a file first");

// //     const code = editor.document.getText();
// //     clearAndShow();
// //     log(" Evaluating code for endpoints...");

// //     const endpoints = await analyzeCode(code);
// //     log("Endpoints extracted: " + JSON.stringify(endpoints, null, 2));

// //     const panel = getOrCreatePanel(context);
// //     panel.webview.postMessage({ type: "setEndpoints", endpoints });
// //   });

// //   const feedbackCmd = vscode.commands.registerCommand("gemini.feedbackCode", async () => {
// //     const editor = vscode.window.activeTextEditor;
// //     if (!editor) return vscode.window.showInformationMessage("Open a file first");

// //     const code = editor.document.getText();
// //     clearAndShow();
// //     log(" Generating feedback...");

// //     const feedback = await analyzeEdgeCases(code);
// //     log("Feedback results: " + JSON.stringify(feedback, null, 2));

// //     const panel = getOrCreatePanel(context);
// //     panel.webview.postMessage({ type: "setFeedback", feedbackResults: feedback });
// //   });




// let lastAnalyzedFile: string | null = null;

// export function activate(context: vscode.ExtensionContext) {
 

//   //  Whenever a file is opened, remember its path
//   vscode.workspace.onDidOpenTextDocument((doc) => {
//     lastAnalyzedFile = doc.uri.fsPath;
//   });

//   const explainCmd = vscode.commands.registerCommand(
//     "gemini.explainCode",
//     async () => {
//       let code: string | null = null;
//       let filePath: string | null = null;

//       const editor = vscode.window.activeTextEditor;
//    if (editor) {
//   code = editor.document.getText();
//   filePath = editor.document.uri.fsPath;

//   lastAnalyzedFile = filePath; //  NEW — remember this file
// } else if (  lastAnalyzedFile) {
//   const doc = await vscode.workspace.openTextDocument(  lastAnalyzedFile);
//   code = doc.getText();
//   filePath =   lastAnalyzedFile;
//   lastAnalyzedFile = filePath; //  remember here too
// }

//       if (!code) {
//         vscode.window.showInformationMessage("Open a file to analyze");
//         return;
//       }

//       clearAndShow();
//       log("Evaluating Code for API endpoint extraction and auto-field addition\n");

//       try {
//         // Analyze code to extract endpoints
//         const endpoints = await analyzeCode(code);
//         if (endpoints.length === 0) {
//           vscode.window.showErrorMessage("No endpoints extracted.");
//           return;
//         }

//         log("Endpoints:" + JSON.stringify(endpoints, null, 2));

//         // Run tests on the endpoints
//         log("Running tests...");
//         let testResults: any[] = [];
//         try {
//           testResults = await runTests(endpoints);
//           log("Test results:");
//           log(JSON.stringify(testResults, null, 2));
//         } catch (err: any) {
//           log("Error running tests: " + String(err));
//         }

//         // Create React Webview
//         log("Creating Webview...");
//         const panel = createWebviewPanel(context);

//         // Send endpoints + test results when React is ready
//         const handleMessage = panel.webview.onDidReceiveMessage((message) => {
//           if (message.type === "reactReady") {
//             log("React ready — sending endpoints and test results");
//             panel.webview.postMessage({
//               type: "setEndpoints",
//               endpoints: endpoints,
//               testResults: testResults,
//             });
//           }
//         });

//         // Clean up when panel is closed
//         panel.onDidDispose(() => handleMessage.dispose());
//       } catch (err: any) {
//         log("Gemini call error: " + String(err));
//         vscode.window.showErrorMessage(
//           "Gemini request failed — see output channel"
//         );
//       }
//     }
//   );

// const feedbackCmd = vscode.commands.registerCommand(
//     "gemini.feedbackCode",
//     async () => {
//     let code: string | null = null;
// let filePath: string | null = null;

// const editor = vscode.window.activeTextEditor;
// if (editor) {
//   code = editor.document.getText();
//   filePath = editor.document.uri.fsPath;
//   lastAnalyzedFile = filePath;
//   lastAnalyzedFile = filePath;
// } else if (lastAnalyzedFile) {
//   // If no editor, use the last analyzed file
//   const doc = await vscode.workspace.openTextDocument(lastAnalyzedFile);
//   code = doc.getText();
//   filePath = lastAnalyzedFile;
// } else if (lastAnalyzedFile) {
//   const doc = await vscode.workspace.openTextDocument(lastAnalyzedFile);
//   code = doc.getText();
//   filePath = lastAnalyzedFile;
// }

// if (!code) {
//   vscode.window.showInformationMessage("No file found to analyze");
//   return;
// }


//       clearAndShow();
//       log("Sending code for feedback...\n");

//       try {
//         const feedback = await analyzeEdgeCases(code);

//         if (!feedback || feedback.length === 0) {
//           vscode.window.showErrorMessage("No feedback generated.");
//           return;
//         }

//         log("\n=== Edge Case Feedback ===\n");
//         log(JSON.stringify(feedback, null, 2));

//         // Create React Webview
//         log("Creating Webview...");
//         const panel = createWebviewPanel(context);

//         // Handle messages from React
//         const handleMessage = panel.webview.onDidReceiveMessage(async (message) => {
//           switch (message.type) {
//             case "reactReady":
//               log("React ready — sending feedback results");
//               panel.webview.postMessage({
//                 type: "setFeedback",
//                 feedbackResults: feedback,
//               });
//               break;

//             case "runCommand":
//               if (message.command) {
//                 log(`Running VS Code command: ${message.command}`);
//                 await vscode.commands.executeCommand(message.command);
//               }
//               break;
//           }
//         });

//         panel.onDidDispose(() => handleMessage.dispose());
//       } catch (err: any) {
//         log("Gemini feedback error: " + String(err));
//         vscode.window.showErrorMessage(
//           "Gemini feedback request failed — see output channel"
//         );
//       }
//     }
//   );







//   //extension.ts 
//   const docGenCmd = vscode.commands.registerCommand("gemini.generateApiDocs", async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showErrorMessage("Please open a file containing API code.");
//       return;
//     }

//     const code = editor.document.getText();

//     vscode.window.withProgress(
//       {
//         location: vscode.ProgressLocation.Notification,
//         title: "Generating API documentation...",
//         cancellable: false,
//       },
//       async () => {
//         try {
//           const markdown = await generateApiDocsFromCode(code);
//           await saveDocumentationToFile(markdown);
          
//         } catch (err: any) {
//           vscode.window.showErrorMessage("Documentation generation failed: " + err.message);
//         }
//       }
//     );
//   });
  
//   context.subscriptions.push(explainCmd, feedbackCmd, docGenCmd);



//   // context.subscriptions.push(explainCmd, feedbackCmd);
// }


// export function deactivate() {}



// ----------------------- not working -------------------





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
//       log("Evaluating Code for API endpoint extraction and auto-field addition\n");

//       try {
//         // Analyze code to extract endpoints
//         const endpoints = await analyzeCode(code);
//         if (endpoints.length === 0) {
//           vscode.window.showErrorMessage("No endpoints extracted.");
//           return;
//         }

//         log("Endpoints:" + JSON.stringify(endpoints, null, 2));

//         // Run tests on the endpoints
//         log("Running tests...");
//         let testResults: any[] = [];
//         try {
//           testResults = await runTests(endpoints);
//           log("Test results:");
//           log(JSON.stringify(testResults, null, 2));
//         } catch (err: any) {
//           log("Error running tests: " + String(err));
//         }

//         // Generate docs
//         // log("Generating docs...");
//         // generateDocs(endpoints);

//         // Create React Webview
//         log("Creating Webview...");
//         const panel = createWebviewPanel(context);

//         // Send endpoints + test results when React is ready
//         const handleMessage = panel.webview.onDidReceiveMessage((message) => {
//           if (message.type === "reactReady") {
//             log("React ready — sending endpoints and test results");
//             panel.webview.postMessage({
//               type: "setEndpoints",
//               endpoints: endpoints,
//               testResults: testResults, // <-- new field
//             });
//           }
//         });

//         // Clean up when panel is closed
//         panel.onDidDispose(() => handleMessage.dispose());

//       } catch (err: any) {
//         log("Gemini call error: " + String(err));
//         vscode.window.showErrorMessage(
//           "Gemini request failed — see output channel"
//         );
//       }
//     }
//   );

//   // const feedbackCmd = vscode.commands.registerCommand(
//   //   "gemini.feedbackCode",
//   //   async () => {
//   //     const editor = vscode.window.activeTextEditor;
//   //     if (!editor) {
//   //       vscode.window.showInformationMessage("Open a file to analyze");
//   //       return;
//   //     }

//   //     const code = editor.document.getText();
//   //     clearAndShow();
//   //     log("Sending code for feedback...\n");

//   //     try {
//   //       const feedback = await analyzeEdgeCases(code);

//   //       if (feedback.length === 0) {
//   //         vscode.window.showErrorMessage("No feedback generated.");
//   //         return;
//   //       }

//   //       log("\n=== Edge Case Feedback ===\n");
//   //       log(JSON.stringify(feedback, null, 2));
//   //     } catch (err: any) {
//   //       log("Gemini feedback error: " + String(err));
//   //       vscode.window.showErrorMessage(
//   //         "Gemini feedback request failed — see output channel"
//   //       );
//   //     }
//   //   }
//   // );


// //   const feedbackCmd = vscode.commands.registerCommand(
// //   "gemini.feedbackCode",
// //   async () => {
// //     const editor = vscode.window.activeTextEditor;
// //     if (!editor) {
// //       vscode.window.showInformationMessage("Open a file to analyze");
// //       return;
// //     }

// //     const code = editor.document.getText();
// //     clearAndShow();
// //     log("Sending code for feedback...\n");

// //     try {
// //       const feedback = await analyzeEdgeCases(code);

// //       if (!feedback || feedback.length === 0) {
// //         vscode.window.showErrorMessage("No feedback generated.");
// //         return;
// //       }

// //       log("\n=== Edge Case Feedback ===\n");
// //       log(JSON.stringify(feedback, null, 2));

// //       // Create React Webview (same as in explain command)
// //       log("Creating Webview...");
// //       const panel = createWebviewPanel(context);

// //       // Wait for React to signal it's ready, then send the feedback
// //       const handleMessage = panel.webview.onDidReceiveMessage((message) => {
// //         if (message.type === "reactReady") {
// //           log("React ready — sending feedback results");
// //           panel.webview.postMessage({
// //             type: "setFeedback",
// //             feedbackResults: feedback,  // send your array
// //           });
// //         }
// //       });

// //       // Clean up when panel closes
// //       panel.onDidDispose(() => handleMessage.dispose());
      
// //     } catch (err: any) {
// //       log("Gemini feedback error: " + String(err));
// //       vscode.window.showErrorMessage(
// //         "Gemini feedback request failed — see output channel"
// //       );
// //     }
// //   }
// // );

// const feedbackCmd = vscode.commands.registerCommand(
//   "gemini.feedbackCode",
//   async () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showInformationMessage("Open a file to analyze");
//       return;
//     }

//     const code = editor.document.getText();
//     clearAndShow();
//     log("Sending code for feedback...\n");

//     try {
//       const feedback = await analyzeEdgeCases(code);

//       if (!feedback || feedback.length === 0) {
//         vscode.window.showErrorMessage("No feedback generated.");
//         return;
//       }

//       log("\n=== Edge Case Feedback ===\n");
//       log(JSON.stringify(feedback, null, 2));

//       //  Create React Webview (same as explain command)
//       log("Creating Webview...");
//       const panel = createWebviewPanel(context);

//       // Listen for messages from the React webview
//       const handleMessage = panel.webview.onDidReceiveMessage(async (message) => {
//         switch (message.type) {
//           case "reactReady":
//             log("React ready — sending feedback results");
//             panel.webview.postMessage({
//               type: "setFeedback",
//               feedbackResults: feedback,
//             });
//             break;

//           //  Allow React to trigger VS Code commands
//           case "runCommand":
//             if (message.command) {
//               log(`Running VS Code command: ${message.command}`);
//               await vscode.commands.executeCommand(message.command);
//             }
//             break;
//         }
//       });

//       //  Clean up when panel closes
//       panel.onDidDispose(() => handleMessage.dispose());

//     } catch (err: any) {
//       log("Gemini feedback error: " + String(err));
//       vscode.window.showErrorMessage(
//         "Gemini feedback request failed — see output channel"
//       );
//     }
//   }
// );



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

