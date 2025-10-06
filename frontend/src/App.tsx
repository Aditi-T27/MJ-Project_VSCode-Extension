import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import ActionButtons from './components/ActionButtons';
import Tabs from './components/Tabs';
import EndpointsList from './components/EndpointsList';
import DetailsPanel from './components/DetailsPanel';
import Notification from './components/Notification';

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

type Theme = 'dark' | 'light';
type ActiveTab = 'all' | 'success' | 'error';
type SuccessType = 'documentation' | 'feedback' | false;

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

const APITesterUI: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<SuccessType>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  // Endpoints received from VS Code
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  // New: test results received from VS Code
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  console.log("From Test Results in all", testResults);

  useEffect(() => {
    console.log('Endpoints state:', endpoints);
  }, [endpoints]);

  useEffect(() => {
    const vscode: VSCodeAPI | undefined =
      typeof window !== 'undefined'
        ? (window.acquireVsCodeApi?.() || window.vscode)
        : undefined;
    vscode?.postMessage({ type: 'reactReady' });
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as
        | { type: string; endpoints?: Endpoint[]; testResults?: TestResult[] }
        | undefined;

      if (!message) return;
      if (message.type === 'setEndpoints') {
        if (message.endpoints) setEndpoints(message.endpoints);
        if (message.testResults) setTestResults(message.testResults);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    console.log('Theme changed to:', theme);
  };

  const handleGenerateDocs = (): void => {
    setIsGeneratingDocs(true);
    setTimeout(() => {
      setIsGeneratingDocs(false);
      setShowSuccess('documentation');
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  const handleAnalyzeFeedback = (): void => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSuccess('feedback');
      setTimeout(() => setShowSuccess(false), 3000);
      if (typeof window !== 'undefined' && window.vscode) {
        window.vscode.postMessage({ command: 'analyzeFeedback' });
      }
    }, 2500);
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? 'var(--vscode-input-background, #3c3c3c)' : 'var(--vscode-input-background, #ffffff)',
    border: `1px solid ${isDark ? 'var(--vscode-input-border, #3c3c3c)' : 'var(--vscode-input-border, #d0d0d0)'}`,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '12px'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'var(--vscode-button-background, #0078d4)',
    color: 'var(--vscode-button-foreground, #ffffff)',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: 1
  };

  return (
    <div style={containerStyle}>
      <Notification showSuccess={showSuccess} />
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <StatsBar
        successCount={successCount}
        errorCount={errorCount}
        avgResponseTime={avgResponseTime}
        endpointsLength={endpoints.length}
        cardStyle={cardStyle}
      />
      <ActionButtons
        isGeneratingDocs={isGeneratingDocs}
        isAnalyzing={isAnalyzing}
        handleGenerateDocs={handleGenerateDocs}
        handleAnalyzeFeedback={handleAnalyzeFeedback}
        buttonStyle={buttonStyle}
      />
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        endpointsLength={endpoints.length}
        successCount={successCount}
        errorCount={errorCount}
      />
      <div style={{ padding: '0 24px 24px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          width: '100%',
        }}>
          <EndpointsList
            endpoints={filteredEndpoints.map(ep => ({
              method: ep.method,
              endpoint: ep.endpoint,
              body: ep.response
            }))}
            selectedEndpoint={selectedEndpoint ? {
              method: selectedEndpoint.method,
              endpoint: selectedEndpoint.endpoint,
              body: selectedEndpoint.response
            } : null}
            setSelectedEndpoint={ep => {
              const found = endpoints.find(e => e.method === ep.method && e.endpoint === ep.endpoint);
              setSelectedEndpoint(found || null);
            }}
            cardStyle={cardStyle}
          />
          <DetailsPanel
            newPoint={testResults}
            
            cardStyle={cardStyle}
          />
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        .method-get { background-color: #007acc !important; }
        .method-post { background-color: #4caf50 !important; }
        .method-put { background-color: #ff9800 !important; }
        .method-delete { background-color: #f44336 !important; }
        .method-default { background-color: #666666 !important; }
      `}</style>
    </div>
  );
};

export default APITesterUI;




// import React, { useState, useEffect } from 'react';
// import Header from './components/Header';
// import StatsBar from './components/StatsBar';
// import ActionButtons from './components/ActionButtons';
// import Tabs from './components/Tabs';
// import EndpointsList from './components/EndpointsList';
// import DetailsPanel from './components/DetailsPanel';
// import Notification from './components/Notification';

// // Type definitions
// interface ErrorDetails {
//   code: string;
//   message: string;
//   details: string;
// }

// interface Endpoint {
//   id: number;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   endpoint: string;
//   status: 'success' | 'error';
//   responseTime: number;
//   response?: any;
//   error?: ErrorDetails;
//   timestamp: string;
//   path:string;
// }

// type Theme = 'dark' | 'light';
// type ActiveTab = 'all' | 'success' | 'error';
// type SuccessType = 'documentation' | 'feedback' | false;

// interface TestResult {
//   id: number;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   path: string;
//   status: 'success' | 'error';
//   responseTime: number;
//   error?: ErrorDetails;
//   timestamp: string;
// }


// const APITesterUI: React.FC = () => {
//   const [theme, setTheme] = useState<Theme>('dark');
//   const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
//   const [isGeneratingDocs, setIsGeneratingDocs] = useState<boolean>(false);
//   const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
//   const [showSuccess, setShowSuccess] = useState<SuccessType>(false);
//   const [activeTab, setActiveTab] = useState<ActiveTab>('all');

//   // Endpoints received from VS Code
//   const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
//   // New: test results received from VS Code
//   const [testResults, setTestResults] = useState<TestResult[]>([]);
//  console.log("From Test Results in all"+ testResults,)
//   useEffect(() => {
//     console.log('Endpoints state:', endpoints);
//   }, [endpoints]);

  

//   useEffect(() => {
//     const vscode =
//       (window as unknown).acquireVsCodeApi?.() || (window as any).vscode;
//     vscode?.postMessage({ type: 'reactReady' });
//   }, []);

//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       const message = event.data;
//       if (message.type === 'setEndpoints') {
//         if (message.endpoints) setEndpoints(message.endpoints);
//         if (message.testResults) setTestResults(message.testResults);
//       }
//     };

//     window.addEventListener('message', handleMessage);
//     return () => window.removeEventListener('message', handleMessage);
//   }, []);

//   const toggleTheme = (): void => {
//     setTheme(theme === 'dark' ? 'light' : 'dark');
//     console.log('Theme changed to:', theme);
//   };

//   const handleGenerateDocs = (): void => {
//     setIsGeneratingDocs(true);
//     setTimeout(() => {
//       setIsGeneratingDocs(false);
//       setShowSuccess('documentation');
//       setTimeout(() => setShowSuccess(false), 3000);
//     }, 2000);
//   };

//   const handleAnalyzeFeedback = (): void => {
//     setIsAnalyzing(true);
//     setTimeout(() => {
//       setIsAnalyzing(false);
//       setShowSuccess('feedback');
//       setTimeout(() => setShowSuccess(false), 3000);
//       if (typeof window !== 'undefined' && (window as any).vscode) {
//         (window as any).vscode.postMessage({ command: 'analyzeFeedback' });
//       }
//     }, 2500);
//   };

//   // Filter endpoints based on active tab
//   const filteredEndpoints: Endpoint[] = endpoints.filter((ep: Endpoint) => {
//     if (activeTab === 'success') return ep.status === 'success';
//     if (activeTab === 'error') return ep.status === 'error';
//     return true;
//   });

//   const successCount: number = endpoints.filter(ep => ep.status === 'success').length;
//   const errorCount: number = endpoints.filter(ep => ep.status === 'error').length;
//   const avgResponseTime: number =
//     endpoints.length > 0
//       ? Math.round(endpoints.reduce((sum, ep) => sum + (ep.responseTime || 0), 0) / endpoints.length)
//       : 0;

//   const isDark: boolean = theme === 'dark';

//   const containerStyle: React.CSSProperties = {
//     minHeight: '100vh',
//     backgroundColor: isDark ? 'var(--vscode-editor-background, #1e1e1e)' : 'var(--vscode-editor-background, #ffffff)',
//     color: isDark ? 'var(--vscode-editor-foreground, #cccccc)' : 'var(--vscode-editor-foreground, #333333)',
//     fontFamily: 'var(--vscode-editor-font-family, "Segoe UI", Arial, sans-serif)',
//     fontSize: 'var(--vscode-editor-font-size, 14px)',
//     transition: 'all 0.5s ease',
//     width: '100vw',
//     maxWidth: '100vw',
//     margin: 0,
//     boxSizing: 'border-box',
//     padding: 0,
//   };

//   const cardStyle: React.CSSProperties = {
//     backgroundColor: isDark ? 'var(--vscode-input-background, #3c3c3c)' : 'var(--vscode-input-background, #ffffff)',
//     border: `1px solid ${isDark ? 'var(--vscode-input-border, #3c3c3c)' : 'var(--vscode-input-border, #d0d0d0)'}`,
//     borderRadius: '12px',
//     padding: '20px',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     marginBottom: '12px'
//   };

//   const buttonStyle: React.CSSProperties = {
//     backgroundColor: 'var(--vscode-button-background, #0078d4)',
//     color: 'var(--vscode-button-foreground, #ffffff)',
//     border: 'none',
//     borderRadius: '12px',
//     padding: '16px 24px',
//     fontSize: '14px',
//     fontWeight: '500',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '8px',
//     flex: 1
//   };

//   return (
//     <div style={containerStyle}>
//       <Notification showSuccess={showSuccess} />
//       <Header isDark={isDark} toggleTheme={toggleTheme} />
//       <StatsBar
//         successCount={successCount}
//         errorCount={errorCount}
//         avgResponseTime={avgResponseTime}
//         endpointsLength={endpoints.length}
//         cardStyle={cardStyle}
//       />
//       <ActionButtons
//         isGeneratingDocs={isGeneratingDocs}
//         isAnalyzing={isAnalyzing}
//         handleGenerateDocs={handleGenerateDocs}
//         handleAnalyzeFeedback={handleAnalyzeFeedback}
//         buttonStyle={buttonStyle}
//       />
//       <Tabs
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         endpointsLength={endpoints.length}
//         successCount={successCount}
//         errorCount={errorCount}
//       />
//       <div style={{ padding: '0 24px 24px 24px' }}>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: '1fr 1fr',
//           gap: '24px',
//           width: '100%',
//         }}>
//           <EndpointsList
//             endpoints={filteredEndpoints.map(ep => ({
//               method: ep.method,
//               endpoint: ep.endpoint,
//               body: ep.response
//             }))}
//             selectedEndpoint={selectedEndpoint ? {
//               method: selectedEndpoint.method,
//               endpoint: selectedEndpoint.endpoint,
//               body: selectedEndpoint.response
//             } : null}
//             setSelectedEndpoint={ep => {
//               const found = endpoints.find(e => e.method === ep.method && e.endpoint === ep.endpoint);
//               setSelectedEndpoint(found || null);
//             }}
//             cardStyle={cardStyle}
//           />
//           <DetailsPanel
//             newPoint={selectedEndpoint}
//         // ✅ new prop passed here
//             cardStyle={cardStyle}
//           />
//         </div>
//       </div>
//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
//         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
//         .method-get { background-color: #007acc !important; }
//         .method-post { background-color: #4caf50 !important; }
//         .method-put { background-color: #ff9800 !important; }
//         .method-delete { background-color: #f44336 !important; }
//         .method-default { background-color: #666666 !important; }
//       `}</style>
//     </div>
//   );
// };

// export default APITesterUI;






// // import React, { useState, useEffect } from 'react';
// // import Header from './components/Header';
// // import StatsBar from './components/StatsBar';
// // import ActionButtons from './components/ActionButtons';
// // import Tabs from './components/Tabs';
// // import EndpointsList from './components/EndpointsList';
// // import DetailsPanel from './components/DetailsPanel';
// // import Notification from './components/Notification';

// // // Type definitions
// // interface ErrorDetails {
// //   code: string;
// //   message: string;
// //   details: string;
// // }

// // interface Endpoint {
// //   id: number;
// //   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// //   endpoint: string;
// //   status: 'success' | 'error';
// //   responseTime: number;
// //   response?: any;
// //   error?: ErrorDetails;
// //   timestamp: string;
// // }

// // type Theme = 'dark' | 'light';
// // type ActiveTab = 'all' | 'success' | 'error';
// // type SuccessType = 'documentation' | 'feedback' | false;

// // const APITesterUI: React.FC = () => {
// //   const [theme, setTheme] = useState<Theme>('dark');
// //   const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
// //   const [isGeneratingDocs, setIsGeneratingDocs] = useState<boolean>(false);
// //   const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
// //   const [showSuccess, setShowSuccess] = useState<SuccessType>(false);
// //   const [activeTab, setActiveTab] = useState<ActiveTab>('all');

// //   // Endpoints received from VS Code
// //   const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

// //    useEffect(() => {
// //   console.log('Endpoints state:', endpoints);
// // }, [endpoints]);

  
// //   // Listen for messages from VS Code
// //  useEffect(() => {
// //   const vscode = (window as any).acquireVsCodeApi?.() || (window as any).vscode;
// //   vscode?.postMessage({ type: 'reactReady' });
// //   }, []);

// //   useEffect(() => {
// //     // const vscode = (window as any).acquireVsCodeApi?.() || (window as any).vscode;

// //     const handleMessage = (event: MessageEvent) => {
// //       const message = event.data;
// //       if (message.type === 'setEndpoints') {
// //         setEndpoints(message.endpoints);
// //       }
// //     };

// //     window.addEventListener('message', handleMessage);
// //     return () => window.removeEventListener('message', handleMessage);
// //   }, []);

// //   const toggleTheme = (): void => {
// //     setTheme(theme === 'dark' ? 'light' : 'dark');
// //     console.log('Theme changed to:', theme);
// //   };

// //   const handleGenerateDocs = (): void => {
// //     setIsGeneratingDocs(true);
// //     setTimeout(() => {
// //       setIsGeneratingDocs(false);
// //       setShowSuccess('documentation');
// //       setTimeout(() => setShowSuccess(false), 3000);
// //     }, 2000);
// //   };

// //   const handleAnalyzeFeedback = (): void => {
// //     setIsAnalyzing(true);
// //     setTimeout(() => {
// //       setIsAnalyzing(false);
// //       setShowSuccess('feedback');
// //       setTimeout(() => setShowSuccess(false), 3000);
// //       if (typeof window !== 'undefined' && (window as any).vscode) {
// //         (window as any).vscode.postMessage({ command: 'analyzeFeedback' });
// //       }
// //     }, 2500);
// //   };

// //   // Filter endpoints based on active tab
// //   const filteredEndpoints: Endpoint[] = endpoints.filter((ep: Endpoint) => {
// //     if (activeTab === 'success') return ep.status === 'success';
// //     if (activeTab === 'error') return ep.status === 'error';
// //     return true;
// //   });

// //   const successCount: number = endpoints.filter(ep => ep.status === 'success').length;
// //   const errorCount: number = endpoints.filter(ep => ep.status === 'error').length;
// //   const avgResponseTime: number =
// //     endpoints.length > 0
// //       ? Math.round(endpoints.reduce((sum, ep) => sum + (ep.responseTime || 0), 0) / endpoints.length)
// //       : 0;

// //   const isDark: boolean = theme === 'dark';

// //   const containerStyle: React.CSSProperties = {
// //     minHeight: '100vh',
// //     backgroundColor: isDark ? 'var(--vscode-editor-background, #1e1e1e)' : 'var(--vscode-editor-background, #ffffff)',
// //     color: isDark ? 'var(--vscode-editor-foreground, #cccccc)' : 'var(--vscode-editor-foreground, #333333)',
// //     fontFamily: 'var(--vscode-editor-font-family, "Segoe UI", Arial, sans-serif)',
// //     fontSize: 'var(--vscode-editor-font-size, 14px)',
// //     transition: 'all 0.5s ease',
// //     width: '100vw',
// //     maxWidth: '100vw',
// //     margin: 0,
// //     boxSizing: 'border-box',
// //     padding: 0,
// //   };

// //   const cardStyle: React.CSSProperties = {
// //     backgroundColor: isDark ? 'var(--vscode-input-background, #3c3c3c)' : 'var(--vscode-input-background, #ffffff)',
// //     border: `1px solid ${isDark ? 'var(--vscode-input-border, #3c3c3c)' : 'var(--vscode-input-border, #d0d0d0)'}`,
// //     borderRadius: '12px',
// //     padding: '20px',
// //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
// //     cursor: 'pointer',
// //     transition: 'all 0.3s ease',
// //     marginBottom: '12px'
// //   };

// //   const buttonStyle: React.CSSProperties = {
// //     backgroundColor: 'var(--vscode-button-background, #0078d4)',
// //     color: 'var(--vscode-button-foreground, #ffffff)',
// //     border: 'none',
// //     borderRadius: '12px',
// //     padding: '16px 24px',
// //     fontSize: '14px',
// //     fontWeight: '500',
// //     cursor: 'pointer',
// //     transition: 'all 0.3s ease',
// //     display: 'flex',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: '8px',
// //     flex: 1
// //   };

// //   return (
// //     <div style={containerStyle}>
// //       <Notification showSuccess={showSuccess} />
// //       <Header isDark={isDark} toggleTheme={toggleTheme} />
// //       <StatsBar
// //         successCount={successCount}
// //         errorCount={errorCount}
// //         avgResponseTime={avgResponseTime}
// //         endpointsLength={endpoints.length}
// //         cardStyle={cardStyle}
// //       />
// //       <ActionButtons
// //         isGeneratingDocs={isGeneratingDocs}
// //         isAnalyzing={isAnalyzing}
// //         handleGenerateDocs={handleGenerateDocs}
// //         handleAnalyzeFeedback={handleAnalyzeFeedback}
// //         buttonStyle={buttonStyle}
// //       />
// //       <Tabs
// //         activeTab={activeTab}
// //         setActiveTab={setActiveTab}
// //         endpointsLength={endpoints.length}
// //         successCount={successCount}
// //         errorCount={errorCount}
// //       />
// //       <div style={{ padding: '0 24px 24px 24px' }}>
// //         <div style={{
// //           display: 'grid',
// //           gridTemplateColumns: '1fr 1fr',
// //           gap: '24px',
// //           width: '100%',
// //         }}>
          
// //           <EndpointsList
// //             endpoints={filteredEndpoints.map(ep => ({
// //               method: ep.method,
// //               endpoint: ep.endpoint,
// //               body: ep.response // or undefined if not applicable
// //             }))}
// //             selectedEndpoint={selectedEndpoint ? {
// //               method: selectedEndpoint.method,
// //               endpoint: selectedEndpoint.endpoint,
// //               body: selectedEndpoint.response
// //             } : null}
// //             setSelectedEndpoint={ep => {
// //               const found = endpoints.find(e => e.method === ep.method && e.endpoint === ep.endpoint);
// //               setSelectedEndpoint(found || null);
// //             }}
// //             cardStyle={cardStyle}
// //           />
// //           <DetailsPanel
// //             selectedEndpoint={selectedEndpoint}
// //             cardStyle={cardStyle}
// //           />
// //         </div>
// //       </div>
// //       <style>{`
// //         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// //         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
// //         @keyframes slideInRight { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
// //         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// //         @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
// //         @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
// //         .method-get { background-color: #007acc !important; }
// //         .method-post { background-color: #4caf50 !important; }
// //         .method-put { background-color: #ff9800 !important; }
// //         .method-delete { background-color: #f44336 !important; }
// //         .method-default { background-color: #666666 !important; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default APITesterUI;





// // // import React, { useState } from 'react';
// // // import Header from './components/Header';
// // // import StatsBar from './components/StatsBar';
// // // import ActionButtons from './components/ActionButtons';
// // // import Tabs from './components/Tabs';
// // // import EndpointsList from './components/EndpointsList';
// // // import DetailsPanel from './components/DetailsPanel';
// // // import Notification from './components/Notification';

// // // // ...type definitions
// // // interface ErrorDetails {
// // //   code: string;
// // //   message: string;
// // //   details: string;
// // // }

// // // interface Endpoint {
// // //   id: number;
// // //   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
// // //   path: string;
// // //   status: 'success' | 'error';
// // //   responseTime: number;
// // //   response?: any;
// // //   error?: ErrorDetails;
// // //   timestamp: string;
// // // }

// // // type Theme = 'dark' | 'light';
// // // type ActiveTab = 'all' | 'success' | 'error';
// // // type SuccessType = 'documentation' | 'feedback' | false;

// // // const APITesterUI: React.FC = () => {
// // //   const [theme, setTheme] = useState<Theme>('dark');
// // //   const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
// // //   const [isGeneratingDocs, setIsGeneratingDocs] = useState<boolean>(false);
// // //   const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
// // //   const [showSuccess, setShowSuccess] = useState<SuccessType>(false);
// // //   const [activeTab, setActiveTab] = useState<ActiveTab>('all');

// // //   // Mock data (unchanged)
// // //   const [endpoints, ] = useState<Endpoint[]>([
// // //     {
// // //       id: 1,
// // //       method: 'GET',
// // //       path: '/api/users',
// // //       status: 'success',
// // //       responseTime: 145,
// // //       response: { data: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }], count: 2 },
// // //       timestamp: '2025-10-01T10:30:00Z'
// // //     },
// // //     {
// // //       id: 2,
// // //       method: 'POST',
// // //       path: '/api/users',
// // //       status: 'success',
// // //       responseTime: 230,
// // //       response: { id: 3, name: 'New User', created: true },
// // //       timestamp: '2025-10-01T10:31:00Z'
// // //     },
// // //     {
// // //       id: 3,
// // //       method: 'GET',
// // //       path: '/api/products',
// // //       status: 'error',
// // //       responseTime: 5000,
// // //       error: {
// // //         code: 'TIMEOUT',
// // //         message: 'Request timeout after 5000ms',
// // //         details: 'The server took too long to respond. Consider optimizing database queries or increasing timeout limits.'
// // //       },
// // //       timestamp: '2025-10-01T10:32:00Z'
// // //     },
// // //     {
// // //       id: 4,
// // //       method: 'PUT',
// // //       path: '/api/users/:id',
// // //       status: 'error',
// // //       responseTime: 89,
// // //       error: {
// // //         code: 'VALIDATION_ERROR',
// // //         message: 'Invalid input data',
// // //         details: 'The "email" field is required and must be a valid email address. The "age" field must be a positive integer.'
// // //       },
// // //       timestamp: '2025-10-01T10:33:00Z'
// // //     },
// // //     {
// // //       id: 5,
// // //       method: 'DELETE',
// // //       path: '/api/users/:id',
// // //       status: 'success',
// // //       responseTime: 112,
// // //       response: { deleted: true, id: 3 },
// // //       timestamp: '2025-10-01T10:34:00Z'
// // //     },
// // //     {
// // //       id: 6,
// // //       method: 'GET',
// // //       path: '/api/orders',
// // //       status: 'success',
// // //       responseTime: 298,
// // //       response: { orders: [], total: 0 },
// // //       timestamp: '2025-10-01T10:35:00Z'
// // //     }
// // //   ]);

// // //   const toggleTheme = (): void => {
// // //     setTheme(theme === 'dark' ? 'light' : 'dark');
// // //     console.log('Theme changed to:', theme);
// // //   };

// // //   const handleGenerateDocs = (): void => {
// // //     setIsGeneratingDocs(true);
// // //     setTimeout(() => {
// // //       setIsGeneratingDocs(false);
// // //       setShowSuccess('documentation');
// // //       setTimeout(() => setShowSuccess(false), 3000);
    
// // //     }, 2000);
// // //   };

// // //   const handleAnalyzeFeedback = (): void => {
// // //     setIsAnalyzing(true);
// // //     setTimeout(() => {
// // //       setIsAnalyzing(false);
// // //       setShowSuccess('feedback');
// // //       setTimeout(() => setShowSuccess(false), 3000);
// // //       // Message to VS Code extension
// // //       if (typeof window !== 'undefined' && (window as any).vscode) {
// // //         (window as any).vscode.postMessage({ command: 'analyzeFeedback' });
// // //       }
// // //     }, 2500);
// // //   };

// // //   const filteredEndpoints: Endpoint[] = endpoints.filter((ep: Endpoint) => {
// // //     if (activeTab === 'success') return ep.status === 'success';
// // //     if (activeTab === 'error') return ep.status === 'error';
// // //     return true;
// // //   });

// // //   const successCount: number = endpoints.filter((ep: Endpoint) => ep.status === 'success').length;
// // //   const errorCount: number = endpoints.filter((ep: Endpoint) => ep.status === 'error').length;
// // //   const avgResponseTime: number = Math.round(
// // //     endpoints.reduce((sum: number, ep: Endpoint) => sum + ep.responseTime, 0) / endpoints.length
// // //   );

// // //   const isDark: boolean = theme === 'dark';

// // //   // const getMethodColor = (method: string): string => {
// // //   //   switch (method) {
// // //   //     case 'GET': return 'method-get';
// // //   //     case 'POST': return 'method-post';
// // //   //     case 'PUT': return 'method-put';
// // //   //     case 'DELETE': return 'method-delete';
// // //   //     default: return 'method-default';
// // //   //   }
// // //   // };

// // //   // VS Code theme-aware styles
// // //   const containerStyle: React.CSSProperties = {
// // //     minHeight: '100vh',
// // //     backgroundColor: isDark ? 'var(--vscode-editor-background, #1e1e1e)' : 'var(--vscode-editor-background, #ffffff)',
// // //     color: isDark ? 'var(--vscode-editor-foreground, #cccccc)' : 'var(--vscode-editor-foreground, #333333)',
// // //     fontFamily: 'var(--vscode-editor-font-family, "Segoe UI", Arial, sans-serif)',
// // //     fontSize: 'var(--vscode-editor-font-size, 14px)',
// // //     transition: 'all 0.5s ease',
// // //     width: '100vw',         // <-- Use viewport width
// // //     maxWidth: '100vw',      // <-- Ensure it fills the window
// // //     margin: 0,              // <-- Remove centering
// // //     boxSizing: 'border-box',
// // //     padding: 0,
// // //   };

// // //   // const headerStyle: React.CSSProperties = {
// // //   //   backgroundColor: isDark ? 'var(--vscode-panel-background, #252526)' : 'var(--vscode-panel-background, #f8f8f8)',
// // //   //   borderBottom: `1px solid ${isDark ? 'var(--vscode-panel-border, #3c3c3c)' : 'var(--vscode-panel-border, #e5e5e5)'}`,
// // //   //   position: 'sticky',
// // //   //   top: 0,
// // //   //   zIndex: 40,
// // //   //   backdropFilter: 'blur(8px)',
// // //   //   padding: '24px'
// // //   // };

// // //   const cardStyle: React.CSSProperties = {
// // //     backgroundColor: isDark ? 'var(--vscode-input-background, #3c3c3c)' : 'var(--vscode-input-background, #ffffff)',
// // //     border: `1px solid ${isDark ? 'var(--vscode-input-border, #3c3c3c)' : 'var(--vscode-input-border, #d0d0d0)'}`,
// // //     borderRadius: '12px',
// // //     padding: '20px',
// // //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
// // //     cursor: 'pointer',
// // //     transition: 'all 0.3s ease',
// // //     marginBottom: '12px'
// // //   };

// // //   const buttonStyle: React.CSSProperties = {
// // //     backgroundColor: 'var(--vscode-button-background, #0078d4)',
// // //     color: 'var(--vscode-button-foreground, #ffffff)',
// // //     border: 'none',
// // //     borderRadius: '12px',
// // //     padding: '16px 24px',
// // //     fontSize: '14px',
// // //     fontWeight: '500',
// // //     cursor: 'pointer',
// // //     transition: 'all 0.3s ease',
// // //     display: 'flex',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: '8px',
// // //     flex: 1
// // //   };

// // //   return (
// // //     <div style={containerStyle}>
// // //       <Notification showSuccess={showSuccess} />
// // //       <Header isDark={isDark} toggleTheme={toggleTheme} />
// // //       <StatsBar
// // //         successCount = {successCount}
// // //         errorCount = {errorCount}
// // //         avgResponseTime={avgResponseTime}
// // //         endpointsLength={endpoints.length}
// // //         cardStyle={cardStyle}
// // //       />
// // //       <ActionButtons
// // //         isGeneratingDocs={isGeneratingDocs}
// // //         isAnalyzing={isAnalyzing}
// // //         handleGenerateDocs={handleGenerateDocs}
// // //         handleAnalyzeFeedback={handleAnalyzeFeedback}
// // //         buttonStyle={buttonStyle}
// // //       />
// // //       <Tabs
// // //         activeTab={activeTab}
// // //         setActiveTab={setActiveTab}
// // //         endpointsLength={endpoints.length}
// // //         successCount={successCount}
// // //         errorCount={errorCount}
// // //       />
// // //       <div style={{ padding: '0 24px 24px 24px' }}>
// // //         <div style={{
// // //           display: 'grid',
// // //           gridTemplateColumns: '1fr 1fr',
// // //           gap: '24px',
// // //           width: '100%',
// // //         }}>
// // //           <EndpointsList
// // //             endpoints={filteredEndpoints}
// // //             selectedEndpoint={selectedEndpoint}
// // //             setSelectedEndpoint={setSelectedEndpoint}
// // //             cardStyle={cardStyle}
// // //           />
// // //           <DetailsPanel
// // //             selectedEndpoint={selectedEndpoint}
// // //             cardStyle={cardStyle}
// // //           />
// // //         </div>
// // //       </div>
// // //       <style>{`
// // //         @keyframes fadeIn {
// // //           from { opacity: 0; }
// // //           to { opacity: 1; }
// // //         }
// // //         @keyframes fadeInUp {
// // //           from {
// // //             opacity: 0;
// // //             transform: translateY(20px);
// // //           }
// // //           to {
// // //             opacity: 1;
// // //             transform: translateY(0);
// // //           }
// // //         }
// // //         @keyframes slideInRight {
// // //           from {
// // //             opacity: 0;
// // //             transform: translateX(100px);
// // //           }
// // //           to {
// // //             opacity: 1;
// // //             transform: translateX(0);
// // //           }
// // //         }
// // //         @keyframes spin {
// // //           from { transform: rotate(0deg); }
// // //           to { transform: rotate(360deg); }
// // //         }
// // //         @keyframes bounce {
// // //           0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
// // //           40% { transform: translateY(-10px); }
// // //           60% { transform: translateY(-5px); }
// // //         }
// // //         @keyframes pulse {
// // //           0% { opacity: 1; }
// // //           50% { opacity: 0.5; }
// // //           100% { opacity: 1; }
// // //         }
// // //         .method-get { background-color: #007acc !important; }
// // //         .method-post { background-color: #4caf50 !important; }
// // //         .method-put { background-color: #ff9800 !important; }
// // //         .method-delete { background-color: #f44336 !important; }
// // //         .method-default { background-color: #666666 !important; }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default APITesterUI;

