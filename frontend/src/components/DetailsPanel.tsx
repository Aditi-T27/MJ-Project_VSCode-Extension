import React from 'react';
import { CheckCircle, AlertCircle, Zap } from 'lucide-react';

interface ErrorDetails {
  code: string;
  message: string;
  details: string;
}

interface Endpoint {
  id: number;
  method: string;
  path: string;
  status: string;
  responseTime: number;
  response?: any;
  error?: ErrorDetails;
  timestamp: string;
}

interface DetailsPanelProps {
  selectedEndpoint: Endpoint | null;
  cardStyle: React.CSSProperties;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedEndpoint, cardStyle }) => (
  <div style={{
    ...cardStyle,
    position: 'sticky',
    top: '96px',
    height: 'fit-content',
    width: '100%',
    minWidth: 0,
    maxWidth: '600px',
    overflow: 'auto',
  }}>
    {selectedEndpoint ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Endpoint Header */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              backgroundColor: selectedEndpoint.status === 'success' ? 'var(--vscode-testing-iconPassed, #4caf50)' : 'var(--vscode-testing-iconFailed, #f44336)',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              animation: 'bounce 1s ease-in-out infinite'
            }}>
              {selectedEndpoint.status === 'success' ? (
                <CheckCircle size={24} color="white" />
              ) : (
                <AlertCircle size={24} color="white" />
              )}
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: 'var(--vscode-editor-foreground)'
              }}>
                {selectedEndpoint.status === 'success' ? 'Success' : 'Error Details'}
              </h2>
              <p style={{
                margin: 0,
                color: 'var(--vscode-descriptionForeground, #999999)'
              }}>
                {selectedEndpoint.path}
              </p>
            </div>
          </div>
        </div>
        {/* Response/Error Details */}
        {selectedEndpoint.status === 'success' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid var(--vscode-input-border, #3c3c3c)`
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: 'var(--vscode-editor-foreground)'
              }}>
                Response Data
              </h3>
              <pre style={{
                fontSize: '14px',
                color: 'var(--vscode-testing-iconPassed, #4caf50)',
                overflow: 'auto',
                wordBreak: 'break-word',
                margin: 0,
                fontFamily: 'var(--vscode-editor-font-family, monospace)'
              }}>
                {JSON.stringify(selectedEndpoint.response, null, 2)}
              </pre>
            </div>
            <div style={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderLeft: `4px solid var(--vscode-testing-iconPassed, #4caf50)`,
              padding: '16px',
              borderRadius: '4px'
            }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--vscode-testing-iconPassed, #4caf50)',
                margin: 0
              }}>
                ✓ Request completed successfully in {selectedEndpoint.responseTime}ms
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              borderLeft: `4px solid var(--vscode-testing-iconFailed, #f44336)`,
              padding: '16px',
              borderRadius: '4px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 'bold',
                margin: '0 0 4px 0',
                color: 'var(--vscode-testing-iconFailed, #f44336)'
              }}>
                {selectedEndpoint.error?.code}
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--vscode-testing-iconFailed, #f44336)',
                margin: 0
              }}>
                {selectedEndpoint.error?.message}
              </p>
            </div>
            <div style={{
              backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid var(--vscode-input-border, #3c3c3c)`
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: 'var(--vscode-editor-foreground)'
              }}>
                Suggested Fix
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'var(--vscode-editor-foreground)',
                margin: 0,
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}>
                {selectedEndpoint.error?.details}
              </p>
            </div>
          </div>
        )}
        {/* Meta Info */}
        <div style={{
          backgroundColor: 'var(--vscode-textCodeBlock-background, #1e1e1e)',
          padding: '16px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--vscode-descriptionForeground, #999999)'
            }}>Method</span>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--vscode-editor-foreground)'
            }}>
              {selectedEndpoint.method}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--vscode-descriptionForeground, #999999)'
            }}>Response Time</span>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--vscode-editor-foreground)'
            }}>
              {selectedEndpoint.responseTime}ms
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{
              fontSize: '14px',
              color: 'var(--vscode-descriptionForeground, #999999)'
            }}>Timestamp</span>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--vscode-editor-foreground)'
            }}>
              {new Date(selectedEndpoint.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        gap: '16px',
        padding: '48px 24px'
      }}>
        <div style={{
          backgroundColor: 'var(--vscode-button-secondaryBackground, #5a5a5a)',
          padding: '24px',
          borderRadius: '50%',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          <Zap size={48} color="var(--vscode-descriptionForeground, #999999)" />
        </div>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--vscode-editor-foreground)',
            margin: '0 0 8px 0'
          }}>
            No endpoint selected
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'var(--vscode-descriptionForeground, #999999)',
            margin: 0
          }}>
            Click on an endpoint to view details
          </p>
        </div>
      </div>
    )}
  </div>
);

export default DetailsPanel;