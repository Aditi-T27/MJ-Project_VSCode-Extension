import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ActionButtons from './components/ActionButtons';
import Tabs from './components/Tabs';
import EndpointsList from './components/EndpointsList';
import DetailsPanel from './components/DetailsPanel';
// import Notification from './components/Notification';
// import { Routes,Route, useNavigate } from "react-router-dom";
// import { Routes,Route} from "react-router-dom";
// import FeedbackViewer from './components/FeedbackAnalysisPage';
import type { ApiFdk} from "./types/types";


// interface FeedbackAnalysisProps {
//   feedbackResults: ApiFdk[];
// }
// Type definitions
interface ErrorDetails {
  code: string;
  message: string;
  details: string;
}

interface Endpoint {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  status: 'success' | 'error';
  responseTime: number;
  response?: unknown;
  error?: ErrorDetails;
  timestamp: string;
  path: string;
}

export interface EdgeCase {
  field: string;
  issue: string;
  testCase: string;
  handlingSuggestion: string;
}

export interface ApiFeedback {
  method: string;
  endpoint: string;
  inputFields: string[];
  possibleEdgeCases: EdgeCase[];
  suggestedImprovements: string[];
}

// type Theme = 'dark' | 'light';
// type ActiveTab = 'all' | 'success' | 'error';
// type SuccessType = 'documentation' | 'feedback' | false;

interface TestResult {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'success' | 'error';
  responseTime: number;
  error?: ErrorDetails;
  timestamp: string;
}

interface VSCodeAPI {
  postMessage: (message: object) => void;
}

declare global {
  interface Window {
    acquireVsCodeApi?: () => VSCodeAPI;
    vscode?: VSCodeAPI;
  }
}

const vscodeApi: VSCodeAPI | undefined =
  typeof window !== "undefined"
    ? window.vscode || window.acquireVsCodeApi?.()
    : undefined;

if (vscodeApi && !window.vscode) {
  window.vscode = vscodeApi; // store globally once to prevent re-acquiring
}
const APITesterUI: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  // const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [showSuccess, setShowSuccess] = useState<SuccessType>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'success' | 'error'>('all');
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [feedbackResults, setFeedbackResults] = useState<ApiFdk[]>([]);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);
//  const navigate = useNavigate();

  useEffect(() => {
    console.log('Endpoints state:', endpoints);
  }, [endpoints]);

  // useEffect(() => {
  //   const vscode: VSCodeAPI | undefined =
  //     typeof window !== 'undefined'
  //       ? (window.acquireVsCodeApi?.() || window.vscode)
  //       : undefined;
  //   vscode?.postMessage({ type: 'reactReady' });
  // }, []);



  // Put this at the very top of your file, outside your component


// Inside your component
useEffect(() => {
  vscodeApi?.postMessage({ type: "reactReady" });
}, []);


// useEffect(() => {
//   vscodeApi?.postMessage({ type: "reactReady" });
//   const handleVisibilityChange = () => {
//     if (document.visibilityState === "visible") {
//       vscodeApi?.postMessage({ type: "reactReady" });
//     }
//   };
//   document.addEventListener("visibilitychange", handleVisibilityChange);
//   return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
// }, []);


  // useEffect(() => {
  //   const handleMessage = (event: MessageEvent) => {
  //     const message = event.data as
  //       | { type: string; endpoints?: Endpoint[]; testResults?: TestResult[] }
  //       | undefined;

  //     if (!message) return;
  //     if (message.type === 'setEndpoints') {
  //       if (message.endpoints) setEndpoints(message.endpoints);
  //       if (message.testResults) setTestResults(message.testResults);
  //     }
  //   };

  
  //   window.addEventListener('message', handleMessage);
  //   return () => window.removeEventListener('message', handleMessage);
  // }, []);

  //prior handleMessage

//   useEffect(() => {
//   const handleMessage = (event: MessageEvent) => {
//     const message = event.data as
//       | { type: string; endpoints?: Endpoint[]; testResults?: TestResult[]; feedbackResults?: unknown[] }
//       | undefined;

//     if (!message) return;

//     switch (message.type) {
//       case "setEndpoints":
//         if (message.endpoints) setEndpoints(message.endpoints);
//         if (message.testResults) setTestResults(message.testResults);
//         break;

//       case "setFeedback":
//         if (message.feedbackResults) {
//           console.log(" Received feedback results:", message.feedbackResults);
//           setFeedbackResults(message.feedbackResults);
//         }
//         break;

//       default:
//         break;
//     }
//   };

//   window.addEventListener("message", handleMessage);
//   return () => window.removeEventListener("message", handleMessage);
// }, []);

//  const navigate = useNavigate();


// useEffect(() => {
//   //Declare navigate inside component

//   const handleMessage = (event: MessageEvent) => {
//     const message = event.data as
//       | {
//           type: string;
//           endpoints?: Endpoint[];
//           testResults?: TestResult[];
//           feedbackResults?: ApiFdk[];
//         }
//       | undefined;

//     if (!message) return;

//     switch (message.type) {
//       case "setEndpoints":
//         if (message.endpoints) setEndpoints(message.endpoints);
//         if (message.testResults) setTestResults(message.testResults);
//         break;

//       case "setFeedback":
//         if (message.feedbackResults) {
//           console.log("✅ Received feedback results:", message.feedbackResults);
//           setFeedbackResults(message.feedbackResults);

//           // ✅ Navigate to feedback page after data arrives
//           navigate("/feedback-analysis", { state: { feedbackResults } });
//         }
//         break;

//       default:
//         break;
//     }
//   };

//   window.addEventListener("message", handleMessage);
//   return () => window.removeEventListener("message", handleMessage);
// }, [feedbackResults, navigate]);


//  useEffect(() => {
//     vscodeApi?.postMessage({ type: "reactReady" });
//   }, []);

  // 🔹 Handle messages from extension
useEffect(() => {
  // Tell VS Code we’re ready to receive messages
  vscodeApi?.postMessage({ type: "reactReady" });

  // Listen for messages from extension
  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    if (!message) return;

    switch (message.type) {
      case "setEndpoints":
        setEndpoints(message.endpoints || []);
        setTestResults(message.testResults || []);
        break;

      case "setFeedback":
        console.log("Feedback received:", message.feedbackResults);
        console.log(JSON.stringify(message, null, 2));
        setFeedbackResults(message.feedbackResults);
        break;
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);



// working code :)
// useEffect(() => {
//   const handleMessage = (event: MessageEvent) => {
//     const message = event.data as
//       | {
//           type: string;
//           endpoints?: Endpoint[];
//           testResults?: TestResult[];
//           feedbackResults?: ApiFdk[];
//         }
//       | undefined;

//     if (!message) return;

//     switch (message.type) {
//       case "setEndpoints":
//         if (message.endpoints) setEndpoints(message.endpoints);
//         if (message.testResults) setTestResults(message.testResults);
//         break;

//       case "setFeedback":
//         if (message.feedbackResults) {
//           console.log("Received feedback results:", message.feedbackResults);
//           setFeedbackResults(message.feedbackResults);

//           //  Navigate when feedback data arrives
//           window.history.pushState({}, "", "/feedback-analysis");
//           window.dispatchEvent(new PopStateEvent("popstate"));
//         }
//         break;

//       default:
//         break;
//     }
//   };

//   window.addEventListener("message", handleMessage);
//   return () => window.removeEventListener("message", handleMessage);
// }, []);


//-=-=-=-=-=-=-==-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-==--=-=
  // const toggleTheme = (): void => {
  //   setTheme(theme === 'dark' ? 'light' : 'dark');
  //   console.log('Theme changed to:', theme);
  // };

  // const handleGenerateDocs = (): void => {
  //   setIsGeneratingDocs(true);
  //   setTimeout(() => {
  //     setIsGeneratingDocs(false);
  //     setShowSuccess('documentation');
  //     setTimeout(() => setShowSuccess(false), 3000);
  //   }, 2000);
  // };

  // const handleAnalyzeFeedback = (): void => {
  //   setIsAnalyzing(true);
  //   setTimeout(() => {
  //     setIsAnalyzing(false);
  //     setShowSuccess('feedback');
  //     setTimeout(() => setShowSuccess(false), 3000);
  //     if (typeof window !== 'undefined' && window.vscode) {
  //       window.vscode.postMessage({ command: 'analyzeFeedback' });
  //     }
  //       navigate("/feedback-analysis"); 
  //   }, 2500);
  // };


//   const handleAnalyzeFeedback = (): void => {
//   setIsAnalyzing(true);

//   setTimeout(() => {
//     setIsAnalyzing(false);
//     setShowSuccess('feedback');
//     setTimeout(() => setShowSuccess(false), 3000);

//     if (typeof window !== 'undefined' && window.vscode) {
//       //  Run the VS Code command directly
//       window.vscode.postMessage({ type: 'runCommand', command: 'gemini.feedbackCode' });
//     }

//     // Navigate to feedback page — the data will come once the command runs
//     navigate("/feedback-analysis");
//   }, 2500);
// };



// prior code 
// const handleAnalyzeFeedback = (): void => {
//   setIsAnalyzing(true);
//  console.log("Button Clicks- for debug")
//   // Listen for messages from the VS Code extension
//   const handleMessage = (event: MessageEvent) => {
//     const message = event.data;

//     if (message.type === "setFeedback") {
//       // Got feedback results from extension
//       console.log("Feedback received:", message.feedbackResults);
      
//       // (Optional) You can store feedback in context or state here
//       // setFeedbackData(message.feedbackResults);

//       // Navigate only when ready
//       // navigate("/feedback-analysis");

//       // Cleanup listener and loader
//       window.removeEventListener("message", handleMessage);
//       setIsAnalyzing(false);
//       setShowSuccess("feedback");
//       setTimeout(() => setShowSuccess(false), 3000);
//     }
//   };

//   window.addEventListener("message", handleMessage);

//   // 🔹 Trigger VS Code command (this starts the process)
//   const vscodeApi: VSCodeAPI | undefined =
//     typeof window !== "undefined"
//       ? (window.acquireVsCodeApi?.() || window.vscode)
//       : undefined;

//   if (vscodeApi && typeof vscodeApi.postMessage === "function") {
//     vscodeApi.postMessage({
//       type: "runCommand",
//       command: "gemini.feedbackCode",
//     });
//   } else {
//     console.warn("VS Code API is not available; cannot run extension command.");
//     // Cleanup listener and loader if the command cannot be dispatched
//     window.removeEventListener("message", handleMessage);
//     setIsAnalyzing(false);
//   }
// };

//prior 1 code
// const handleAnalyzeFeedback = (): void => {
//   setIsAnalyzing(true);
//   console.log("Button Clicked — starting feedback command");

//   const handleMessage = (event: MessageEvent) => {
//     const message = event.data;

//     if (message.type === "setFeedback") {
//       console.log(" Feedback received:", message.feedbackResults);
//       setFeedbackResults(message.feedbackResults);

//       //  Stop loader & show success
//       setIsAnalyzing(false);
//       setShowSuccess("feedback");
//       setTimeout(() => setShowSuccess(false), 3000);

//       //  Navigate to feedback page once data arrives
//       window.removeEventListener("message", handleMessage);
//       window.history.pushState({}, "", "/feedback-analysis");
//       window.dispatchEvent(new PopStateEvent("popstate"));
//     }
//   };

//   window.addEventListener("message", handleMessage);

//   //  Post message to VS Code
//   if (vscodeApi && typeof vscodeApi.postMessage === "function") {
//     vscodeApi.postMessage({
//       type: "runCommand",
//       command: "gemini.feedbackCode",
//     });
//   } else {
//     console.warn("VS Code API not available — cannot run extension command.");
//     window.removeEventListener("message", handleMessage);
//     setIsAnalyzing(false);
//   }
// };

const handleAnalyzeFeedback = (): void => {
  console.log("Button Clicked — starting feedback command");
  setIsAnalyzing(true);

  if (vscodeApi && typeof vscodeApi.postMessage === "function") {
    vscodeApi.postMessage({
      type: "runCommand",
      command: "gemini.feedbackCode",
    });
  } else {
    console.warn("VS Code API not available — cannot run extension command.");
    setIsAnalyzing(false);
  }
};

const handleGenerateDocs = (): void => {
  console.log("Button Clicked — starting documentation");
  setIsGeneratingDocs(true);

  if (vscodeApi && typeof vscodeApi.postMessage === "function") {vscodeApi.postMessage({
      type: "runCommand",
      command: "gemini.generateApiDocs", // runs your backend/docs command
    });
   
  } else {
    console.warn("VS Code API not available — cannot run extension command.");
    setIsGeneratingDocs(false);
  }
};

  // Filter endpoints based on active tab
  const filteredEndpoints: Endpoint[] = endpoints.filter((ep: Endpoint) => {
    if (activeTab === 'success') return ep.status === 'success';
    if (activeTab === 'error') return ep.status === 'error';
    return true;
  });

  const successCount: number = endpoints.filter(ep => ep.status === 'success').length;
  const errorCount: number = endpoints.filter(ep => ep.status === 'error').length;
  const avgResponseTime: number =
    endpoints.length > 0
      ? Math.round(endpoints.reduce((sum, ep) => sum + (ep.responseTime || 0), 0) / endpoints.length)
      : 0;

  const isDark: boolean = theme === 'dark';

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: isDark ? 'var(--vscode-editor-background, #1e1e1e)' : 'var(--vscode-editor-background, #ffffff)',
    color: isDark ? 'var(--vscode-editor-foreground, #cccccc)' : 'var(--vscode-editor-foreground, #333333)',
    fontFamily: 'var(--vscode-editor-font-family, "Segoe UI", Arial, sans-serif)',
    fontSize: 'var(--vscode-editor-font-size, 14px)',
    transition: 'all 0.5s ease',
    width: '100vw',
    maxWidth: '100vw',
    margin: 0,
    boxSizing: 'border-box',
    padding: 0,
  };

  // const cardStyle: React.CSSProperties = {
  //   backgroundColor: isDark ? 'var(--vscode-input-background, #3c3c3c)' : 'var(--vscode-input-background, #ffffff)',
  //   border: `1px solid ${isDark ? 'var(--vscode-input-border, #3c3c3c)' : 'var(--vscode-input-border, #d0d0d0)'}`,
  //   borderRadius: '12px',
  //   padding: '20px',
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  //   cursor: 'pointer',
  //   transition: 'all 0.3s ease',
  //   marginBottom: '12px'
  // };

  // const buttonStyle: React.CSSProperties = {
  //   backgroundColor: 'var(--vscode-button-background, #0078d4)',
  //   color: 'var(--vscode-button-foreground, #ffffff)',
  //   border: 'none',
  //   borderRadius: '12px',
  //   padding: '16px 24px',
  //   fontSize: '14px',
  //   fontWeight: '500',
  //   cursor: 'pointer',
  //   transition: 'all 0.3s ease',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   gap: '8px',
  //   flex: 1
  // };
// return (
//   <Routes>
//     {/*Route 1 — your main UI */}
//     <Route
//       path="/"
//       element={
//         <div style={containerStyle}>
//           <Notification showSuccess={showSuccess} />
//           <Header isDark={isDark} toggleTheme={toggleTheme} />
//           <StatsBar
//             successCount={successCount}
//             errorCount={errorCount}
//             avgResponseTime={avgResponseTime}
//             endpointsLength={endpoints.length}
//             cardStyle={cardStyle}
//           />
//           <ActionButtons
//             isGeneratingDocs={isGeneratingDocs}
//             isAnalyzing={isAnalyzing}
//             handleGenerateDocs={handleGenerateDocs}
//             handleAnalyzeFeedback={handleAnalyzeFeedback}
//             buttonStyle={buttonStyle}
//           />
//           <Tabs
//             activeTab={activeTab}
//             setActiveTab={setActiveTab}
//             endpointsLength={endpoints.length}
//             successCount={successCount}
//             errorCount={errorCount}
//           />
//           <div style={{ padding: "0 24px 24px 24px" }}>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "24px",
//                 width: "100%",
//               }}
//             >
//               <EndpointsList
//                 endpoints={filteredEndpoints.map((ep) => ({
//                   method: ep.method,
//                   endpoint: ep.endpoint,
//                   body: ep.response,
//                 }))}
//                 selectedEndpoint={
//                   selectedEndpoint
//                     ? {
//                         method: selectedEndpoint.method,
//                         endpoint: selectedEndpoint.endpoint,
//                         body: selectedEndpoint.response,
//                       }
//                     : null
//                 }
//                 setSelectedEndpoint={(ep) => {
//                   const found = endpoints.find(
//                     (e) => e.method === ep.method && e.endpoint === ep.endpoint
//                   );
//                   setSelectedEndpoint(found || null);
//                 }}
//                 cardStyle={cardStyle}
//               />
//               <DetailsPanel newPoint={testResults} cardStyle={cardStyle} />
//             </div>
//           </div>
//           <style>{`
//             @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//             @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//             @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
//             @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//             @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
//             @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
//             .method-get { background-color: #007acc !important; }
//             .method-post { background-color: #4caf50 !important; }
//             .method-put { background-color: #ff9800 !important; }
//             .method-delete { background-color: #f44336 !important; }
//             .method-default { background-color: #666666 !important; }
//           `}</style>
//         </div>
//       }
//     />

// {/* Route 2 — feedback analysis page */}
// {/* <Route
//     path="/feedback-analysis"
//     element={<FeedbackAnalysisPage />}
//  /> */}
// <Route path="/feedback-analysis" element={<FeedbackViewer feedbackResults={feedbackResults} />} />


//   </Routes>
// );
// };

console.log(":))))"+feedbackResults);
//  return (
//     <div style={containerStyle}>
//       {/* <Notification showSuccess={showSuccess} /> */}
//       <Header isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
//       <StatsBar
//         successCount={successCount}
//         errorCount={errorCount}
//         avgResponseTime={avgResponseTime}
//         endpointsLength={endpoints.length}
//         cardStyle={{ borderRadius: '12px', padding: '20px' }}
//       />
//       <ActionButtons
//        // isGeneratingDocs={isGeneratingDocs}
//        isAnalyzing={isAnalyzing}
//        handleGenerateDocs={() => { } }
//        handleAnalyzeFeedback={handleAnalyzeFeedback}
//        buttonStyle={{ padding: '12px 24px', borderRadius: '10px' }} isGeneratingDocs={false}      />
//       <Tabs
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         endpointsLength={endpoints.length}
//         successCount={successCount}
//         errorCount={errorCount}
//       />

//       {/* 🔹 Main Content */}
//       <div style={{ padding: "0 24px 24px 24px" }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "24px",
//             width: "100%",
//           }}
//         >
//           <EndpointsList
//             endpoints={filteredEndpoints.map((ep) => ({
//               method: ep.method,
//               endpoint: ep.endpoint,
//               body: ep.response,
//             }))}
//             selectedEndpoint={
//               selectedEndpoint
//                 ? {
//                     method: selectedEndpoint.method,
//                     endpoint: selectedEndpoint.endpoint,
//                     body: selectedEndpoint.response,
//                   }
//                 : null
//             }
//             setSelectedEndpoint={(ep) => {
//               const found = endpoints.find(
//                 (e) => e.method === ep.method && e.endpoint === ep.endpoint
//               );
//               setSelectedEndpoint(found || null);
//             }}
//             cardStyle={{ borderRadius: '12px', padding: '20px' }}
//           />
//           <DetailsPanel newPoint={testResults} cardStyle={{ borderRadius: '12px', padding: '20px' }} />
//         </div>

//   {/* 🔹 Show FeedbackViewer below once results are available */}
//   {feedbackResults.length > 0 && (
//     // <div style={{ marginTop: "40px", animation: "fadeIn 0.5s ease" }}>
//     //   <h2 style={{ marginBottom: "16px" }}>🔍 Feedback Analysis</h2>
//     //   <FeedbackViewer feedbackResults={feedbackResults} />
//     // </div>

// <div
//   style={{
//     marginTop: "40px",
//     backgroundColor: "#1e1e1e",
//     padding: "24px",
//     borderRadius: "12px",
//     color: "#e0e0e0",
//     fontFamily: "Segoe UI, sans-serif",
//   }}
// >
//   <h2 style={{ color: "#4FC3F7", marginBottom: "24px" }}>🔍 API Feedback Analysis</h2>

  
    
//     </div>
//   );
return (
  <div style={containerStyle}>
    {/* <Notification showSuccess={showSuccess} /> */}
    <Header
      isDark={isDark}
      toggleTheme={() => setTheme(isDark ? "light" : "dark")}
    />

    <StatsBar
      successCount={successCount}
      errorCount={errorCount}
      avgResponseTime={avgResponseTime}
      endpointsLength={endpoints.length}
      cardStyle={{ borderRadius: "12px", padding: "20px" }}
    />

    <ActionButtons
      isAnalyzing={isAnalyzing}
  handleGenerateDocs={handleGenerateDocs} 
      handleAnalyzeFeedback={handleAnalyzeFeedback}
      buttonStyle={{ padding: "12px 24px", borderRadius: "10px" }}
      isGeneratingDocs={isGeneratingDocs}
    />

    <Tabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      endpointsLength={endpoints.length}
      successCount={successCount}
      errorCount={errorCount}
    />

    {/* 🔹 Main Content */}
    <div style={{ padding: "0 24px 24px 24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          width: "100%",
        }}
      >
        <EndpointsList
          endpoints={filteredEndpoints.map((ep) => ({
            method: ep.method,
            endpoint: ep.endpoint,
            body: ep.response,
          }))}
          selectedEndpoint={
            selectedEndpoint
              ? {
                  method: selectedEndpoint.method,
                  endpoint: selectedEndpoint.endpoint,
                  body: selectedEndpoint.response,
                }
              : null
          }
          setSelectedEndpoint={(ep) => {
            const found = endpoints.find(
              (e) => e.method === ep.method && e.endpoint === ep.endpoint
            );
            setSelectedEndpoint(found || null);
          }}
          cardStyle={{ borderRadius: "12px", padding: "20px" }}
        />

        <DetailsPanel
          newPoint={testResults}
          cardStyle={{ borderRadius: "12px", padding: "20px" }}
        />
      </div>

      {/* 🔹 Feedback Analysis Section */}
      {feedbackResults.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#1e1e1e",
            padding: "24px",
            borderRadius: "12px",
            color: "#e0e0e0",
            fontFamily: "Segoe UI, sans-serif",
          }}
        >
          <h2 style={{ color: "#4FC3F7", marginBottom: "24px" }}>
             API Feedback Analysis
          </h2>

          {feedbackResults.map((api, idx) => (
            <div key={idx} style={{ marginBottom: "32px" }}>
              <h3 style={{ color: "#81C784" }}>
                {api.method} {api.endpoint}
              </h3>
              <p style={{ margin: "8px 0", color: "#bdbdbd" }}>
                <strong>Input Fields:</strong> {api.inputFields.join(", ")}
              </p>

              {api.possibleEdgeCases.map((ec, ecIdx) => (
                <div
                  key={ecIdx}
                  style={{
                    marginTop: "16px",
                    backgroundColor: "#2c2c2c",
                    padding: "16px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ color: "#FFB74D" }}>
                     Issue: {ec.issue} ({ec.field})
                  </h4>

                  {ec.testCases?.map((tc, tIdx) => (
                    <div key={tIdx} style={{ marginLeft: "16px", marginTop: "8px" }}>
                      <p>
                        <strong> Test Input:</strong> {tc.input}
                      </p>
                      <p>
                        <strong> Vulnerability:</strong> {tc.vulnerability}
                      </p>
                      <p>
                        <strong> Solution:</strong> {tc.solution}
                      </p>
                    </div>
                  ))}

                  {ec.suggestedImprovements && ec.suggestedImprovements.length > 0 && (
                    <div style={{ marginTop: "8px", marginLeft: "16px" }}>
                      <strong> Suggested Improvements:</strong>
                      <ul>
                        {ec.suggestedImprovements.map((sug, sIdx) => (
                          <li key={sIdx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

export default APITesterUI;

