import React from 'react';
import { FileText, Loader, MessageSquare } from 'lucide-react';

interface ActionButtonsProps {
  isGeneratingDocs: boolean;
  isAnalyzing: boolean;
  handleGenerateDocs: () => void;
  handleAnalyzeFeedback: () => void;
  buttonStyle: React.CSSProperties;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isGeneratingDocs, isAnalyzing, handleGenerateDocs, handleAnalyzeFeedback, buttonStyle
}) => (
  <div style={{ padding: '24px' }}>
    <div style={{ display: 'flex', gap: '16px' }}>
      <button
        onClick={handleGenerateDocs}
        disabled={isGeneratingDocs}
        style={{
          ...buttonStyle,
          backgroundColor: isGeneratingDocs ? 'var(--vscode-button-secondaryBackground, #5a5a5a)' : 'var(--vscode-button-background, #0078d4)'
        }}
      >
        {isGeneratingDocs ? (
          <>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <FileText size={20} />
            <span>Generate Documentation</span>
          </>
        )}
      </button>
      <button
        onClick={handleAnalyzeFeedback}
        disabled={isAnalyzing}
        style={{
          ...buttonStyle,
          backgroundColor: isAnalyzing ? 'var(--vscode-button-secondaryBackground, #5a5a5a)' : 'var(--vscode-charts-purple, #bc5fd4)'
        }}
      >
        {isAnalyzing ? (
          <>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <MessageSquare size={20} />
            <span>Analyze & Feedback</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default ActionButtons;