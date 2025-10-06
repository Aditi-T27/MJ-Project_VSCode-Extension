import React from 'react';
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface ErrorDetails {
  code: string;
  message: string;
  details: string;
}

interface TestResult {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'success' | 'error';
  responseTime: number;
  error?: ErrorDetails;
  timestamp: string;
  response?: unknown;
}

interface DetailsPanelProps {
  newPoint: TestResult[] | null;
  cardStyle: React.CSSProperties;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ newPoint, cardStyle }) => {
  console.log(JSON.stringify(newPoint, null, 2));

  if (!newPoint || newPoint.length === 0) {
    return (
      <div
        style={{
          ...cardStyle,
          position: 'sticky',
          top: '96px',
          height: 'fit-content',
          width: '100%',
          minWidth: 0,
          maxWidth: '600px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
         
          textAlign: 'center',
          gap: '16px',
          padding: '48px 24px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--vscode-button-secondaryBackground, #5a5a5a)',
            padding: '24px',
            borderRadius: '50%',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <Zap size={48} color="var(--vscode-descriptionForeground, #999999)" />
        </div>
        <div>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--vscode-editor-foreground)',
              margin: '0 0 8px 0',
            }}
          >
            No endpoint selected
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--vscode-descriptionForeground, #999999)',
              margin: 0,
            }}
          >
            Click on an endpoint to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...cardStyle,
        position: 'sticky',
        top: '96px',
        height: 'fit-content',
        width: '100%',
        minWidth: 0,
        maxWidth: '600px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {newPoint.map((result) => (
        <div
          key={result.id}
          style={{
            border: `1px solid var(--vscode-input-border, #3c3c3c)`,
            padding: '16px',
            borderRadius: '12px',
           
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                backgroundColor:
                  result.status === 'success'
                    ? 'var(--vscode-testing-iconPassed, #4caf50)'
                    : 'var(--vscode-testing-iconFailed, #f44336)',
                padding: '12px',
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                animation: 'bounce 1s ease-in-out infinite',
              }}
            >
              {result.status === 'success' ? (
                <CheckCircle size={24} color="white" />
              ) : (
                <AlertCircle size={24} color="white" />
              )}
            </div>
            <div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  margin: '0 0 4px 0',
                  color: 'var(--vscode-editor-foreground)',
                }}
              >
                {result.status === 'success' ? 'Success' : 'Error Details'}
              </h2>
              <p
                style={{
                  margin: 0,
                  color: 'var(--vscode-descriptionForeground, #999999)',
                  fontSize: '14px',
                }}
              >
                {result.path}
              </p>
            </div>
          </div>

          {/* Response / Error Section */}
          {result.status === 'success' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid var(--vscode-input-border, #3c3c3c)`,
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'var(--vscode-editor-foreground)',
                  }}
                >
                  Response Data
                </h3>
                <pre
                  style={{
                    fontSize: '14px',
                    color: 'var(--vscode-testing-iconPassed, #4caf50)',
                    overflow: 'auto',
                    wordBreak: 'break-word',
                    margin: 0,
                    fontFamily: 'var(--vscode-editor-font-family, monospace)',
                  }}
                >
                  {JSON.stringify(result.response || {}, null, 2)}
                </pre>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  borderLeft: `4px solid var(--vscode-testing-iconPassed, #4caf50)`,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--vscode-testing-iconPassed, #4caf50)',
                    margin: 0,
                  }}
                >
                  ✓ Request completed successfully in {result.responseTime}ms
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  borderLeft: `4px solid var(--vscode-testing-iconFailed, #f44336)`,
                  padding: '16px',
                  borderRadius: '4px',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                    color: 'var(--vscode-testing-iconFailed, #f44336)',
                  }}
                >
                  {result.error?.code}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--vscode-testing-iconFailed, #f44336)',
                    margin: 0,
                  }}
                >
                  {result.error?.message}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: `1px solid var(--vscode-input-border, #3c3c3c)`,
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    color: 'var(--vscode-editor-foreground)',
                  }}
                >
                  Suggested Fix
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--vscode-editor-foreground)',
                    margin: 0,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {result.error?.details}
                </p>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div
            style={{
              backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
              padding: '16px',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--vscode-descriptionForeground, #999999)',
                }}
              >
                Method
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--vscode-editor-foreground)',
                }}
              >
                {result.method}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--vscode-descriptionForeground, #999999)',
                }}
              >
                Response Time
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--vscode-editor-foreground)',
                }}
              >
                {result.responseTime}ms
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '14px',
                  color: 'var(--vscode-descriptionForeground, #999999)',
                }}
              >
                Timestamp
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--vscode-editor-foreground)',
                }}
              >
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailsPanel;


// import React from 'react';
// import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

// interface ErrorDetails {
//   code: string;
//   message: string;
//   details: string;
// }

// interface TestResult {
//   id: number;
//   method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
//   path: string;
//   status: 'success' | 'error';
//   responseTime: number;
//   error?: ErrorDetails;
//   timestamp: string;
// }

// interface DetailsPanelProps {
//   newPoint: TestResult[]| null;
//   cardStyle: React.CSSProperties;
// }

// const DetailsPanel: React.FC<DetailsPanelProps> = ({ newPoint, cardStyle }) => {
//  console.log(JSON.stringify(newPoint, null, 2));
//   return (
//     <div
//       style={{
//         ...cardStyle,
//         position: 'sticky',
//         top: '96px',
//         height: 'fit-content',
//         width: '100%',
//         minWidth: 0,
//         maxWidth: '600px',
//         overflow: 'auto',
//       }}
//     >
//       {newPoint ? (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//           {/* Header */}
//           <div>
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 marginBottom: '16px',
//               }}
//             >
//               <div
//                 style={{
//                   backgroundColor:
//                     newPoint.status === 'success'
//                       ? 'var(--vscode-testing-iconPassed, #4caf50)'
//                       : 'var(--vscode-testing-iconFailed, #f44336)',
//                   padding: '12px',
//                   borderRadius: '12px',
//                   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//                   animation: 'bounce 1s ease-in-out infinite',
//                 }}
//               >
//                 {newPoint.status === 'success' ? (
//                   <CheckCircle size={24} color="white" />
//                 ) : (
//                   <AlertCircle size={24} color="white" />
//                 )}
//               </div>
//               <div>
//                 <h2
//                   style={{
//                     fontSize: '24px',
//                     fontWeight: 'bold',
//                     margin: '0 0 4px 0',
//                     color: 'var(--vscode-editor-foreground)',
//                   }}
//                 >
//                   {newPoint.status === 'success'
//                     ? 'Success'
//                     : 'Error Details'}
//                 </h2>
//                 <p
//                   style={{
//                     margin: 0,
//                     color: 'var(--vscode-descriptionForeground, #999999)',
//                   }}
//                 >
//                   {newPoint.path}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Response / Error Section */}
//           {newPoint.status === 'success' ? (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div
//                 style={{
//                   backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//                   padding: '16px',
//                   borderRadius: '8px',
//                   border: `1px solid var(--vscode-input-border, #3c3c3c)`,
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     margin: '0 0 8px 0',
//                     color: 'var(--vscode-editor-foreground)',
//                   }}
//                 >
//                   Response Data
//                 </h3>
//                 <pre
//                   style={{
//                     fontSize: '14px',
//                     color: 'var(--vscode-testing-iconPassed, #4caf50)',
//                     overflow: 'auto',
//                     wordBreak: 'break-word',
//                     margin: 0,
//                     fontFamily: 'var(--vscode-editor-font-family, monospace)',
//                   }}
//                 >
//                   {JSON.stringify(newPoint.response, null, 2)}
//                 </pre>
//               </div>
//               <div
//                 style={{
//                   backgroundColor: 'rgba(76, 175, 80, 0.1)',
//                   borderLeft: `4px solid var(--vscode-testing-iconPassed, #4caf50)`,
//                   padding: '16px',
//                   borderRadius: '4px',
//                 }}
//               >
//                 <p
//                   style={{
//                     fontSize: '14px',
//                     color: 'var(--vscode-testing-iconPassed, #4caf50)',
//                     margin: 0,
//                   }}
//                 >
//                   ✓ Request completed successfully in {newPoint.responseTime}ms
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//               <div
//                 style={{
//                   backgroundColor: 'rgba(244, 67, 54, 0.1)',
//                   borderLeft: `4px solid var(--vscode-testing-iconFailed, #f44336)`,
//                   padding: '16px',
//                   borderRadius: '4px',
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: '14px',
//                     fontWeight: 'bold',
//                     margin: '0 0 4px 0',
//                     color: 'var(--vscode-testing-iconFailed, #f44336)',
//                   }}
//                 >
//                   {newPoint.error?.code}
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: '14px',
//                     color: 'var(--vscode-testing-iconFailed, #f44336)',
//                     margin: 0,
//                   }}
//                 >
//                   {newPoint.error?.message}
//                 </p>
//               </div>
//               <div
//                 style={{
//                   backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//                   padding: '16px',
//                   borderRadius: '8px',
//                   border: `1px solid var(--vscode-input-border, #3c3c3c)`,
//                 }}
//               >
//                 <h3
//                   style={{
//                     fontSize: '14px',
//                     fontWeight: '600',
//                     margin: '0 0 8px 0',
//                     color: 'var(--vscode-editor-foreground)',
//                   }}
//                 >
//                   Suggested Fix
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: '14px',
//                     color: 'var(--vscode-editor-foreground)',
//                     margin: 0,
//                     wordBreak: 'break-word',
//                     overflowWrap: 'break-word',
//                   }}
//                 >
//                   {newPoint.error?.details}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Meta Info */}
//           <div
//             style={{
//               backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//               padding: '16px',
//               borderRadius: '8px',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '8px',
//             }}
//           >
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   color: 'var(--vscode-descriptionForeground, #999999)',
//                 }}
//               >
//                 Method
//               </span>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: 'var(--vscode-editor-foreground)',
//                 }}
//               >
//                 {newPoint.method}
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   color: 'var(--vscode-descriptionForeground, #999999)',
//                 }}
//               >
//                 Response Time
//               </span>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: 'var(--vscode-editor-foreground)',
//                 }}
//               >
//                 {newPoint.responseTime}ms
//               </span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   color: 'var(--vscode-descriptionForeground, #999999)',
//                 }}
//               >
//                 Timestamp
//               </span>
//               <span
//                 style={{
//                   fontSize: '14px',
//                   fontWeight: '500',
//                   color: 'var(--vscode-editor-foreground)',
//                 }}
//               >
//                 {new Date(newPoint.timestamp).toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '100%',
//             textAlign: 'center',
//             gap: '16px',
//             padding: '48px 24px',
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: 'var(--vscode-button-secondaryBackground, #5a5a5a)',
//               padding: '24px',
//               borderRadius: '50%',
//               animation: 'pulse 2s ease-in-out infinite',
//             }}
//           >
//             <Zap size={48} color="var(--vscode-descriptionForeground, #999999)" />
//           </div>
//           <div>
//             <h3
//               style={{
//                 fontSize: '18px',
//                 fontWeight: '600',
//                 color: 'var(--vscode-editor-foreground)',
//                 margin: '0 0 8px 0',
//               }}
//             >
//               No endpoint selected
//             </h3>
//             <p
//               style={{
//                 fontSize: '14px',
//                 color: 'var(--vscode-descriptionForeground, #999999)',
//                 margin: 0,
//               }}
//             >
//               Click on an endpoint to view details
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailsPanel;



// import React from 'react';
// import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

// interface ErrorDetails {
//   code: string;
//   message: string;
//   details: string;
// }

// interface Endpoint {
//   id: number;
//   method: string;
//   endpoint: string;
//   status: string;
//   responseTime: number;
//   response?: unknown;
//   error?: ErrorDetails;
//   timestamp: string;
// }

// interface DetailsPanelProps {
//   newPoint: Endpoint | null;
//   cardStyle: React.CSSProperties;
// }

// const DetailsPanel: React.FC<DetailsPanelProps> = ({ newPoint, cardStyle }) => { 
//    console.log("from details panel"+ newPoint)
  
//   return(  
//   <div style={{
//     ...cardStyle,
//     position: 'sticky',
//     top: '96px',
//     height: 'fit-content',
//     width: '100%',
//     minWidth: 0,
//     maxWidth: '600px',
//     overflow: 'auto',
//   }}>
//     {newPoint ? (
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//         {/* Endpoint Header */}
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
//             <div style={{
//               backgroundColor: newPoint.status === 'success' ? 'var(--vscode-testing-iconPassed, #4caf50)' : 'var(--vscode-testing-iconFailed, #f44336)',
//               padding: '12px',
//               borderRadius: '12px',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//               animation: 'bounce 1s ease-in-out infinite'
//             }}>
//               {newPoint.status === 'success' ? (
//                 <CheckCircle size={24} color="white" />
//               ) : (
//                 <AlertCircle size={24} color="white" />
//               )}
//             </div>
//             <div>
//               <h2 style={{
//                 fontSize: '24px',
//                 fontWeight: 'bold',
//                 margin: '0 0 4px 0',
//                 color: 'var(--vscode-editor-foreground)'
//               }}>
//                 {newPoint.status === 'success' ? 'Success' : 'Error Details'}
//               </h2>
//               <p style={{
//                 margin: 0,
//                 color: 'var(--vscode-descriptionForeground, #999999)'
//               }}>
//                 {newPoint.endpoint}
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* Response/Error Details */}
//         {newPoint.status === 'success' ? (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             <div style={{
//               backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//               padding: '16px',
//               borderRadius: '8px',
//               border: `1px solid var(--vscode-input-border, #3c3c3c)`
//             }}>
//               <h3 style={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 margin: '0 0 8px 0',
//                 color: 'var(--vscode-editor-foreground)'
//               }}>
//                 Response Data
//               </h3>
//               <pre style={{
//                 fontSize: '14px',
//                 color: 'var(--vscode-testing-iconPassed, #4caf50)',
//                 overflow: 'auto',
//                 wordBreak: 'break-word',
//                 margin: 0,
//                 fontFamily: 'var(--vscode-editor-font-family, monospace)'
//               }}>
//                 {JSON.stringify(newPoint.response, null, 2)}
//               </pre>
//             </div>
//             <div style={{
//               backgroundColor: 'rgba(76, 175, 80, 0.1)',
//               borderLeft: `4px solid var(--vscode-testing-iconPassed, #4caf50)`,
//               padding: '16px',
//               borderRadius: '4px'
//             }}>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'var(--vscode-testing-iconPassed, #4caf50)',
//                 margin: 0
//               }}>
//                 ✓ Request completed successfully in {newPoint.responseTime}ms
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             <div style={{
//               backgroundColor: 'rgba(244, 67, 54, 0.1)',
//               borderLeft: `4px solid var(--vscode-testing-iconFailed, #f44336)`,
//               padding: '16px',
//               borderRadius: '4px'
//             }}>
//               <h3 style={{
//                 fontSize: '14px',
//                 fontWeight: 'bold',
//                 margin: '0 0 4px 0',
//                 color: 'var(--vscode-testing-iconFailed, #f44336)'
//               }}>
//                 {newPoint.error?.code}
//               </h3>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'var(--vscode-testing-iconFailed, #f44336)',
//                 margin: 0
//               }}>
//                 {newPoint.error?.message}
//               </p>
//             </div>
//             <div style={{
//               backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//               padding: '16px',
//               borderRadius: '8px',
//               border: `1px solid var(--vscode-input-border, #3c3c3c)`
//             }}>
//               <h3 style={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 margin: '0 0 8px 0',
//                 color: 'var(--vscode-editor-foreground)'
//               }}>
//                 Suggested Fix
//               </h3>
//               <p style={{
//                 fontSize: '14px',
//                 color: 'var(--vscode-editor-foreground)',
//                 margin: 0,
//                 wordBreak: 'break-word',
//                 overflowWrap: 'break-word',
//               }}>
//                 {newPoint.error?.details}
//               </p>
//             </div>
//           </div>
//         )}
//         {/* Meta Info */}
//         <div style={{
//           backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
//           padding: '16px',
//           borderRadius: '8px',
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '8px'
//         }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span style={{
//               fontSize: '14px',
//               color: 'var(--vscode-descriptionForeground, #999999)'
//             }}>Method</span>
//             <span style={{
//               fontSize: '14px',
//               fontWeight: '500',
//               color: 'var(--vscode-editor-foreground)'
//             }}>
//               {newPoint.method}
//             </span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span style={{
//               fontSize: '14px',
//               color: 'var(--vscode-descriptionForeground, #999999)'
//             }}>Response Time</span>
//             <span style={{
//               fontSize: '14px',
//               fontWeight: '500',
//               color: 'var(--vscode-editor-foreground)'
//             }}>
//               {newPoint.responseTime}ms
//             </span>
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <span style={{
//               fontSize: '14px',
//               color: 'var(--vscode-descriptionForeground, #999999)'
//             }}>Timestamp</span>
//             <span style={{
//               fontSize: '14px',
//               fontWeight: '500',
//               color: 'var(--vscode-editor-foreground)'
//             }}>
//               {new Date(newPoint.timestamp).toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </div>
//     ) : (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '100%',
//         textAlign: 'center',
//         gap: '16px',
//         padding: '48px 24px'
//       }}>
//         <div style={{
//           backgroundColor: 'var(--vscode-button-secondaryBackground, #5a5a5a)',
//           padding: '24px',
//           borderRadius: '50%',
//           animation: 'pulse 2s ease-in-out infinite'
//         }}>
//           <Zap size={48} color="var(--vscode-descriptionForeground, #999999)" />
//         </div>
//         <div>
//           <h3 style={{
//             fontSize: '18px',
//             fontWeight: '600',
//             color: 'var(--vscode-editor-foreground)',
//             margin: '0 0 8px 0'
//           }}>
//             No endpoint selected
//           </h3>
//           <p style={{
//             fontSize: '14px',
//             color: 'var(--vscode-descriptionForeground, #999999)',
//             margin: 0
//           }}>
//             Click on an endpoint to view details
//           </p>
//         </div>
//       </div>
//     )}
//   </div>
// )};

// export default DetailsPanel;