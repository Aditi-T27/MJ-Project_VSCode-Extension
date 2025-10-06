
// import fetch from "node-fetch";
// import { Endpoint } from "../utils/types.js";
// import { log } from "../utils/logger.js";

// export async function runTests(endpoints: Endpoint[]) {
//   log("\n=== Running API Tests ===\n");

//   for (const ep of endpoints) {
//     const method = ep.method.toUpperCase();
//     const url = `http://localhost:5000${ep.endpoint}`;

//     try {
//       log(`Testing: [${method}] ${url}`);

//       let options: any = { method };

//     // Only attach body for POST, PUT, PATCH
//     if (["POST", "PUT", "PATCH"].includes(method) && ep.body && Object.keys(ep.body).length > 0) {
//       options.headers = { "Content-Type": "application/json" };
//       options.body = JSON.stringify(ep.body);
//     } else {
//       // Ensure GET/DELETE requests never send a body
//       delete options.body;
//     }

//       const res = await fetch(url, options);

//       // Try to parse response as JSON, fallback to text
//       let data: any;
//       try {
//         data = await res.json();
//       } catch {
//         data = await res.text();
//       }

//       log(`[${method}] ${url} -> Status: ${res.status}`);
//       if (data) log(`Response Data: ${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`);
//     } catch (err: any) {
//       log(`[${method}] ${url} -> ERROR: ${err.message}`);
//     }

//     log("\n---------------------------\n");
//   }

//   log("=== API Tests Completed ===\n");
// }


// import fetch from "node-fetch";
// import { Endpoint } from "../utils/types.js";
// import { log } from "../utils/logger.js";

// interface TestResult {
//   id: number;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   path: string;  // Changed from 'endpoint' to 'path'
//   status: 'success' | 'error';
//   responseTime: number;
//   response?: any;
//   error?: {
//     code: string;
//     message: string;
//     details: string;
//   };
//   timestamp: string;
// }

// export async function runTests(endpoints: Endpoint[]): Promise<TestResult[]> {
//   log("\n=== Running API Tests ===\n");
  
//   const testResults: TestResult[] = [];

//   for (let i = 0; i < endpoints.length; i++) {
//     const ep = endpoints[i];
//     const method = ep.method.toUpperCase();
//     const url = `http://localhost:5000${ep.endpoint}`;
//     const startTime = Date.now();

//     try {
//       log(`Testing: [${method}] ${url}`);

//       let options: any = { method };

//       // Only attach body for POST, PUT, PATCH
//       if (["POST", "PUT", "PATCH"].includes(method) && ep.body && Object.keys(ep.body).length > 0) {
//         options.headers = { "Content-Type": "application/json" };
//         options.body = JSON.stringify(ep.body);
//       } else {
//         // Ensure GET/DELETE requests never send a body
//         delete options.body;
//       }

//       const res = await fetch(url, options);
//       const responseTime = Date.now() - startTime;

//       // Try to parse response as JSON, fallback to text
//       let data: any;
//       try {
//         data = await res.json();
//       } catch {
//         data = await res.text();
//       }

//       const testResult: TestResult = {
//         id: i + 1,
//         method: method as any,
//         path: ep.endpoint,
//         status: res.ok ? 'success' : 'error',
//         responseTime,
//         timestamp: new Date().toISOString()
//       };

//       if (res.ok) {
//         testResult.response = data;
//         log(`[${method}] ${url} -> Status: ${res.status} (${responseTime}ms)`);
//       } else {
//         testResult.error = {
//           code: `HTTP_${res.status}`,
//           message: `Request failed with status ${res.status}`,
//           details: typeof data === 'string' ? data : JSON.stringify(data)
//         };
//         log(`[${method}] ${url} -> ERROR: Status ${res.status}`);
//       }

//       if (data) log(`Response Data: ${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`);
      
//       testResults.push(testResult);

//     } catch (err: any) {
//       const responseTime = Date.now() - startTime;
//       testResults.push({
//         id: i + 1,
//         method: method as any,
//         path: ep.endpoint,
//         status: 'error',
//         responseTime,
//         error: {
//           code: 'NETWORK_ERROR',
//           message: err.message,
//           details: `Failed to connect to ${url}. Make sure the server is running.`
//         },
//         timestamp: new Date().toISOString()
//       });

//       log(`[${method}] ${url} -> ERROR: ${err.message}`);
//     }

//     log("\n---------------------------\n");
//   }

//   log("=== API Tests Completed ===\n");
//   return testResults;
// }

import fetch from "node-fetch";
import { log } from "../utils/logger.js";

interface InputEndpoint {
  method: string;
  endpoint: string;
  body?: any;
}

interface TestResult {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;  // Changed from 'endpoint' to 'path'
  status: 'success' | 'error';
  responseTime: number;
  response?: any;
  error?: {
    code: string;
    message: string;
    details: string;
  };
  timestamp: string;
}

export async function runTests(endpoints: InputEndpoint[]): Promise<TestResult[]> {
  log("\n=== Running API Tests ===\n");
  
  const testResults: TestResult[] = [];

  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i];
    const method = ep.method.toUpperCase();
    const url = `http://localhost:5000${ep.endpoint}`;
    const startTime = Date.now();

    try {
      log(`Testing: [${method}] ${url}`);

      let options: any = { method };

      // Only attach body for POST, PUT, PATCH
      if (["POST", "PUT", "PATCH"].includes(method) && ep.body && Object.keys(ep.body).length > 0) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(ep.body);
      }

      const res = await fetch(url, options);
      const responseTime = Date.now() - startTime;

      // Try to parse response as JSON, fallback to text
      let data: any;
      try {
        data = await res.json();
      } catch {
        data = await res.text();
      }

      const testResult: TestResult = {
        id: i + 1,
        method: method as any,
        path: ep.endpoint,  // Using 'path' instead of 'endpoint'
        status: res.ok ? 'success' : 'error',
        responseTime,
        timestamp: new Date().toISOString()
      };

      if (res.ok) {
        testResult.response = data;
        log(`[${method}] ${url} -> Status: ${res.status} (${responseTime}ms)`);
      } else {
        testResult.error = {
          code: `HTTP_${res.status}`,
          message: `Request failed with status ${res.status}`,
          details: typeof data === 'string' ? data : JSON.stringify(data)
        };
        log(`[${method}] ${url} -> ERROR: Status ${res.status}`);
      }

      if (data) log(`Response Data: ${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`);
      
      testResults.push(testResult);

    } catch (err: any) {
      const responseTime = Date.now() - startTime;
      testResults.push({
        id: i + 1,
        method: method as any,
        path: ep.endpoint,
        status: 'error',
        responseTime,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message,
          details: `Failed to connect to ${url}. Make sure the server is running.`
        },
        timestamp: new Date().toISOString()
      });

      log(`[${method}] ${url} -> ERROR: ${err.message}`);
    }

    log("\n---------------------------\n");
  }

  log("=== API Tests Completed ===\n");
  log(`Returning ${testResults.length} test results to extension`);
  return testResults;
}

