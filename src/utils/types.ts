export type Endpoint = {
  method: string;
  endpoint: string;
  body?: any;
};

export interface AnalysisResult {
  port: number;
  endpoints: Endpoint[];
}