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
  path: string;
  status: 'success' | 'error';
  responseTime: number;
  requestDetails?: {
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response?: any;
  responseHeaders?: Record<string, string>;
  error?: {
    code: string;
    message: string;
    details: string;
    stack?: string;
  };
  timestamp: string;
}

export async function runTests(endpoints: InputEndpoint[]): Promise<TestResult[]> {
  log("\n=== Running Enhanced API Tests ===\n");

  const testResults: TestResult[] = [];

  for (let i = 0; i < endpoints.length; i++) {
    const ep = endpoints[i];
    const method = ep.method.toUpperCase();
  const url = `http://localhost:5000${ep.endpoint}`;
const startTime = Date.now();

try {
  log(`🔹 Testing: [${method}] ${url}`);

  const options: any = {
    method,
    headers: ["POST", "PUT", "PATCH"].includes(method)
      ? { "Content-Type": "application/json" }
      : undefined,
    body: ["POST", "PUT", "PATCH"].includes(method) && ep.body
      ? JSON.stringify(ep.body)
      : undefined
  };

  log(`Request: ${JSON.stringify(options, null, 2)}`);

  const res = await fetch(url, options);  // no need to clone
  



  const responseTime = Date.now() - startTime;

 let dataText = await res.text(); // read body once safely
 let data: any;
 try {
   data = JSON.parse(dataText); // try parse only once
 } catch {
   data = dataText; // fallback to plain text
 }   


  const headersObj = Object.fromEntries(res.headers.entries());

  const testResult: TestResult = {
    id: i + 1,
    method: method as any,
    path: ep.endpoint,
    status: res.ok ? "success" : "error",
    responseTime,
    requestDetails: { url, headers: options.headers, body: ep.body },
    response: data,
    responseHeaders: headersObj,
    timestamp: new Date().toISOString()
  };

  if (res.ok) {
    log(`Success [${res.status}] (${responseTime}ms)`);
    log(`Response Headers: ${JSON.stringify(headersObj, null, 2)}`);
    log(`Response Body: ${typeof data === "object" ? JSON.stringify(data, null, 2) : data}`);
  } else {
    testResult.error = {
      code: `HTTP_${res.status}`,
      message: `Request failed with status ${res.status}`,
      details: typeof data === "string" ? data : JSON.stringify(data, null, 2)
    };
    log(` HTTP Error: ${res.status}`);
    log(` Response: ${testResult.error.details}`);
  }

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
        message: err?.message ?? String(err),
        details: `Failed to connect to ${url}. Make sure the server is running.`,
        stack: err?.stack
      },
      timestamp: new Date().toISOString()
    });

    log(`Error [${method}] ${url} -> ${err?.message ?? String(err)}`);
  }

  }

  log("=== All API Tests Completed ===\n");
  log(`Total Results: ${testResults.length}`);
  return testResults;
}
