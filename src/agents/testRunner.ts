import fetch from "node-fetch";
import { AnalysisResult, Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export async function runTests(endpoints: Endpoint[]) {
  log("\n=== Running Basic GET Tests ===\n");
  for (const ep of endpoints) {
    try {
      if (ep.method.toUpperCase() !== "GET") continue;

      const url = `http://localhost:3000${ep.endpoint}`;
      log(`Testing: ${url}`);

      const res = await fetch(url);
      log(`GET ${url} -> ${res.status}`);
    } catch (err: any) {
      log(`GET ${ep.endpoint} -> ERROR: ${err.message}`);
    }
  }
}
