import * as vscode from "vscode";

export const output = vscode.window.createOutputChannel("Gemini");

export function log(message: string) {
  output.appendLine(message);
}

export function clearAndShow() {
  output.clear();
  output.show(true);
}
