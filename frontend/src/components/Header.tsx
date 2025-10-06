import React from 'react';
import { Zap, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => (
  <header style={{
    backgroundColor: isDark ? 'var(--vscode-panel-background, #252526)' : 'var(--vscode-panel-background, #f8f8f8)',
    borderBottom: `1px solid ${isDark ? 'var(--vscode-panel-border, #3c3c3c)' : 'var(--vscode-panel-border, #e5e5e5)'}`,
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(8px)',
    padding: '24px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '8px',
          borderRadius: '8px'
        }}>
          <Zap size={24} color="white" />
        </div>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 4px 0',
            color: 'var(--vscode-editor-foreground)'
          }}>
            API Tester & Documentation
          </h1>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: 'var(--vscode-descriptionForeground, #999999)'
          }}>
            Test, document, and analyze your APIs
          </p>
        </div>
      </div>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: 'var(--vscode-button-secondaryBackground, #5a5a5a)',
          color: 'var(--vscode-button-secondaryForeground, #ffffff)',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  </header>
);

export default Header;