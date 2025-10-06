export type Endpoint = {
  method: string;
  endpoint: string;
  body?: any;
};

// interface ErrorDetails {
//   code: string;
//   message: string;
//   details: string;
// }

// export interface Endpoint {
//   id: number;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   path: string;
//   status: 'success' | 'error';
//   responseTime: number;
//   response?: any;
//   error?: ErrorDetails;
//   timestamp: string;
// }

export interface AnalysisResult {
  port: number;
  endpoints: Endpoint[];
}