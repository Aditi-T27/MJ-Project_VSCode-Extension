import React from 'react';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

// interface Endpoint {
//   id: number;
//   method: string;
//   path: string;
//   status: string;
//   responseTime: number;
//   timestamp: string;
// }

interface ErrorDetails {
  code: string;
  message: string;
  details: string;
}

interface Endpoint {
  id: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status: 'success' | 'error';
  responseTime: number;
  response?: any;
  error?: ErrorDetails;
  timestamp: string;
}

interface EndpointsListProps {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  setSelectedEndpoint: (ep: Endpoint) => void;
  cardStyle: React.CSSProperties;
}

const EndpointsList: React.FC<EndpointsListProps> = ({
  endpoints, selectedEndpoint, setSelectedEndpoint, cardStyle
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {endpoints.map((endpoint: Endpoint) => (
      <div
        key={endpoint.id}
        onClick={() => setSelectedEndpoint(endpoint)}
        style={{
          ...cardStyle,
          borderWidth: selectedEndpoint?.id === endpoint.id ? '2px' : '1px'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = 'scale(1.02)';
          (e.target as HTMLElement).style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
          (e.target as HTMLElement).style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <div style={{
              backgroundColor: endpoint.status === 'success' ? 'var(--vscode-testing-iconPassed, #4caf50)' : 'var(--vscode-testing-iconFailed, #f44336)',
              padding: '8px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transform: selectedEndpoint?.id === endpoint.id ? 'scale(1.1) rotate(12deg)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}>
              {endpoint.status === 'success' ? (
                <CheckCircle size={20} color="white" />
              ) : (
                <XCircle size={20} color="white" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  backgroundColor: endpoint.method === 'GET' ? '#007acc' :
                                  endpoint.method === 'POST' ? '#4caf50' :
                                  endpoint.method === 'PUT' ? '#ff9800' :
                                  endpoint.method === 'DELETE' ? '#f44336' : '#666666',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {endpoint.method}
                </span>
                <span style={{
                  color: 'var(--vscode-editor-foreground)',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {endpoint.path}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--vscode-descriptionForeground, #999999)'
                }}>
                  {endpoint.responseTime}ms
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--vscode-descriptionForeground, #999999)'
                }}>•</span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--vscode-descriptionForeground, #999999)'
                }}>
                  {new Date(endpoint.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight
            size={20}
            color="var(--vscode-descriptionForeground, #999999)"
            style={{
              transform: selectedEndpoint?.id === endpoint.id ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default EndpointsList;