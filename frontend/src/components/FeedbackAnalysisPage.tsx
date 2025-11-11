


// import React, { useState, useEffect } from "react";
// import type { ApiFdk } from "../types/types"; // adjust the import path as needed

// interface FeedbackViewerProps {
//   feedbackResults?: ApiFdk[]; // optional — you can also send from navigate state
// }

// const FeedbackViewer: React.FC<FeedbackViewerProps> = ({ feedbackResults }) => {
//   const [feedbackData, setFeedbackData] = useState<ApiFdk[]>([]);

//   // Example fallback data
//   const exampleData: ApiFdk[] = [
//     {
//       method: "GET",
//       endpoint: "/products/:id",
//       inputFields: ["id"],
//       possibleEdgeCases: [
//         {
//           field: "id",
//           issue: "Non-numeric value",
//           testCase: "Sending a string like `/products/abc` instead of a number.",
//           handlingSuggestion:
//             "Validate that 'id' is a number using `isNaN()` or regex. Return 400 Bad Request if invalid.",
//         },
//         {
//           field: "id",
//           issue: "Index out of bounds",
//           testCase:
//             "Providing an 'id' that's larger than available products, e.g. `/products/5` with only 2 items.",
//           handlingSuggestion:
//             "Check array bounds (0 ≤ id < array.length). Return 404 if not found.",
//         },
//       ],
//       suggestedImprovements: [
//         "Add validation for invalid IDs.",
//         "Add meaningful 404 messages when item not found.",
//       ],
//     },
//   ];

//   // When `feedbackResults` comes from another page or command
//   useEffect(() => {
//     if (feedbackResults && feedbackResults.length > 0) {
//       setFeedbackData(feedbackResults);
//     }
//   }, [feedbackResults]);

//   return (
//     <div className="p-4">
//       {feedbackData.length === 0 ? (
//         <button
//           onClick={() => setFeedbackData(exampleData)}
//           className="bg-blue-600 text-white px-3 py-2 rounded-lg"
//         >
//           Load Example Data
//         </button>
//       ) : (
//         feedbackData.map((item, index) => (
//           <div key={index} className="mb-6 border p-4 rounded-lg shadow-sm">
//             <h2 className="text-lg font-bold text-blue-700">
//               {item.method} → {item.endpoint}
//             </h2>

//             <h3 className="mt-2 font-semibold">Input Fields:</h3>
//             <ul className="list-disc ml-5">
//               {item.inputFields.map((field, i) => (
//                 <li key={i}>{field}</li>
//               ))}
//             </ul>

//             <h3 className="mt-3 font-semibold">Possible Edge Cases:</h3>
//             <ul className="list-disc ml-5 space-y-2">
//               {item.possibleEdgeCases.map((edge, i) => (
//                 <li key={i}>
//                   <p>
//                     <strong>Issue:</strong> {edge.issue}
//                   </p>
//                   <p>
//                     <strong>Test Case:</strong> {edge.testCase}
//                   </p>
//                   <p>
//                     <strong>Suggestion:</strong> {edge.handlingSuggestion}
//                   </p>
//                 </li>
//               ))}
//             </ul>

//             <h3 className="mt-3 font-semibold">Suggested Improvements:</h3>
//             <ul className="list-disc ml-5">
//               {item.suggestedImprovements.map((s, i) => (
//                 <li key={i}>{s}</li>
//               ))}
//             </ul>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default FeedbackViewer;


// // import React, { useState } from "react";
// // import type { ApiFdk} from "../types/types"; // or wherever you place it

// // const FeedbackViewer: React.FC = () => {
// //   const [feedbackData, setFeedbackData] = useState<ApiFdk[]>([]);

// //   // Example: When you receive the JSON from your VS Code extension or API
// //   const exampleData: ApiFdk[] = [
// //     {
// //       method: "GET",
// //       endpoint: "/products/:id",
// //       inputFields: ["id"],
// //       possibleEdgeCases: [
// //         {
// //           field: "id",
// //           issue: "Non-numeric value",
// //           testCase: "Sending a string like `/products/abc` instead of a number.",
// //           handlingSuggestion:
// //             "Validate that 'id' is a number using `isNaN()` or a regular expression. Return a 400 Bad Request error if it's not.",
// //         },
// //         {
// //           field: "id",
// //           issue: "Index out of bounds",
// //           testCase:
// //             "Providing an 'id' that's larger than the array's maximum index, like `/products/5` when the array only has 2 elements.",
// //           handlingSuggestion:
// //             "Check if the 'id' is within the bounds of the array's indices (0 to array.length - 1). If not, return a 404 Not Found error or a message indicating the product doesn't exist.",
// //         },
// //         {
// //           field: "id",
// //           issue: "Negative value",
// //           testCase: "Providing a negative 'id' like `/products/-1`.",
// //           handlingSuggestion:
// //             "Check if the 'id' is a non-negative number. If negative return 400 bad request",
// //         },
// //       ],
// //       suggestedImprovements: [
// //         "Add error handling for invalid 'id' values to prevent server crashes or unexpected behavior.",
// //         "Implement more robust product retrieval logic (e.g., fetching from a database).",
// //         "Return a more informative response when a product is not found (e.g., a 404 Not Found error with a message).",
// //         "Consider using a more appropriate data structure (like a dictionary/object) if looking up by numerical id doesn't suit your logic.",
// //       ],
// //     },
// //   ];

// //   return (
// //     <div className="p-4">
// //       {feedbackData.length === 0 ? (
// //         <button
// //           onClick={() => setFeedbackData(exampleData)}
// //           className="bg-blue-600 text-white px-3 py-2 rounded-lg"
// //         >
// //           Load Example Data
// //         </button>
// //       ) : (
// //         feedbackData.map((item, index) => (
// //           <div key={index} className="mb-6 border p-4 rounded-lg shadow-sm">
// //             <h2 className="text-lg font-bold text-blue-700">
// //               {item.method} → {item.endpoint}
// //             </h2>

// //             <h3 className="mt-2 font-semibold">Input Fields:</h3>
// //             <ul className="list-disc ml-5">
// //               {item.inputFields.map((field, i) => (
// //                 <li key={i}>{field}</li>
// //               ))}
// //             </ul>

// //             <h3 className="mt-3 font-semibold">Possible Edge Cases:</h3>
// //             <ul className="list-disc ml-5 space-y-2">
// //               {item.possibleEdgeCases.map((edge, i) => (
// //                 <li key={i}>
// //                   <p>
// //                     <strong>Issue:</strong> {edge.issue}
// //                   </p>
// //                   <p>
// //                     <strong>Test Case:</strong> {edge.testCase}
// //                   </p>
// //                   <p>
// //                     <strong>Suggestion:</strong> {edge.handlingSuggestion}
// //                   </p>
// //                 </li>
// //               ))}
// //             </ul>

// //             <h3 className="mt-3 font-semibold">Suggested Improvements:</h3>
// //             <ul className="list-disc ml-5">
// //               {item.suggestedImprovements.map((s, i) => (
// //                 <li key={i}>{s}</li>
// //               ))}
// //             </ul>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // };

// // export default FeedbackViewer;



















// // // src/pages/FeedbackAnalysisPage.tsx
// // // import React from "react";

// // // interface FeedbackAnalysisPageProps {
// // //   feedbackResults: unknown[];
// // // }

// // // const FeedbackAnalysisPage: React.FC<FeedbackAnalysisPageProps> = ({ feedbackResults }) => {
// // //   // You can render your edge cases, suggestions, etc. here.
// // //   return (
// // //     <div>
// // //       <h2>Feedback Analysis</h2>
// // //       <pre>{JSON.stringify(feedbackResults, null, 2)}</pre>
// // //     </div>
// // //   );
// // // };

// // //  export default FeedbackAnalysisPage;

