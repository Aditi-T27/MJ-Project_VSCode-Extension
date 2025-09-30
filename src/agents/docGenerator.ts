import { AnalysisResult, Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export function generateDocs(endpoints: Endpoint[]) {
  log("\n=== Documentation ===\n");
  endpoints.forEach((ep) => {
    log(`- **${ep.method}** ${ep.endpoint}`);
  });
}
