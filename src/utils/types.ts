export interface Endpoint {
  method: string;
  endpoint: string;
}

export interface AnalysisResult {
  port: number;
  endpoints: Endpoint[];
}