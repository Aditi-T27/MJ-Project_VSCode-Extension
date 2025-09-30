// import fetch from "node-fetch";
// import { AnalysisResult, Endpoint } from "../utils/types.js";
// import { log } from "../utils/logger.js";

// export async function runTests(endpoints: Endpoint[]) {
//   log("\n=== Running Basic GET Tests ===\n");
//   for (const ep of endpoints) {
//     try {
//       if (ep.method.toUpperCase() !== "GET")
//         continue; 
 
//       const url = `http://localhost:5000${ep.endpoint}`;
//       log(`Testing: ${url}`);

//       const res = await fetch(url);
//       log(`GET ${url} -> ${res.status}`);
//     } catch (err: any) {
//       log(`GET ${ep.endpoint} -> ERROR: ${err.message}`);
//     }
//   }
// }



import fetch from "node-fetch";
import { Endpoint } from "../utils/types.js";
import { log } from "../utils/logger.js";

export async function runTests(endpoints: Endpoint[]) {
  log("\n=== Running API Tests ===\n");

  for (const ep of endpoints) {
    const method = ep.method.toUpperCase();
    const url = `http://localhost:5000${ep.endpoint}`;

    try {
      log(`Testing: [${method}] ${url}`);

      let options: any = { method };

    // Only attach body for POST, PUT, PATCH
if (["POST", "PUT", "PATCH"].includes(method) && ep.body && Object.keys(ep.body).length > 0) {
  options.headers = { "Content-Type": "application/json" };
  options.body = JSON.stringify(ep.body);
} else {
  // Ensure GET/DELETE requests never send a body
  delete options.body;
}


      const res = await fetch(url, options);

      // Try to parse response as JSON, fallback to text
      let data: any;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      log(`[${method}] ${url} -> Status: ${res.status}`);
      if (data) log(`Response Data: ${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`);
    } catch (err: any) {
      log(`[${method}] ${url} -> ERROR: ${err.message}`);
    }

    log("\n---------------------------\n");
  }

  log("=== API Tests Completed ===\n");
}
