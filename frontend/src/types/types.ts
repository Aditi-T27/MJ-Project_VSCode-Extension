interface TestCase {
  input: string;
  vulnerability: string;
  solution: string;
}

interface EdgeCase {
  field: string;
  issue: string;
  testCases: TestCase[];
  suggestedImprovements: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ApiFdk {
  method: string;
  endpoint: string;
  inputFields: string[];
  possibleEdgeCases: EdgeCase[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// interface FeedbackAnalysisProps {
//   feedbackResults: ApiFdk[];
// }