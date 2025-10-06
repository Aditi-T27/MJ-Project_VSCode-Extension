import React from 'react';

type ActiveTab = 'all' | 'success' | 'error';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: ActiveTab) => void;
  endpointsLength: number;
  successCount: number;
  errorCount: number;
}

const Tabs: React.FC<TabsProps> = ({activeTab, setActiveTab, endpointsLength, successCount, errorCount}) => (
  <div style={{ padding: '0 24px 16px 24px' }}>
    <div style={{
      backgroundColor: 'var(--vscode-tab-inactiveBackground, #2d2d30)',
      padding: '4px',
      borderRadius: '12px',
      display: 'inline-flex',
      gap: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <button
        onClick={() => setActiveTab('all')}
        style={{
          padding: '8px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === 'all' ? 'var(--vscode-tab-activeBackground, #007acc)' : 'transparent',
          color: activeTab === 'all' ? 'var(--vscode-tab-activeForeground, #ffffff)' : 'var(--vscode-tab-inactiveForeground, #cccccc)'
        }}
      >
        All ({endpointsLength})
      </button>
      <button
        onClick={() => setActiveTab('success')}
        style={{
          padding: '8px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === 'success' ? 'var(--vscode-testing-iconPassed, #4caf50)' : 'transparent',
          color: activeTab === 'success' ? '#ffffff' : 'var(--vscode-tab-inactiveForeground, #cccccc)'
        }}
      >
        Success ({successCount})
      </button>
      <button
        onClick={() => setActiveTab('error')}
        style={{
          padding: '8px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          backgroundColor: activeTab === 'error' ? 'var(--vscode-testing-iconFailed, #f44336)' : 'transparent',
          color: activeTab === 'error' ? '#ffffff' : 'var(--vscode-tab-inactiveForeground, #cccccc)'
        }}
      >
        Errors ({errorCount})
      </button>
    </div>
  </div>
);

export default Tabs;