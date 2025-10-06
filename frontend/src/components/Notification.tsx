import React from 'react';
import { CheckCircle } from 'lucide-react';

interface NotificationProps {
  showSuccess: string | false;
}

const Notification: React.FC<NotificationProps> = ({ showSuccess }) => (
  showSuccess ? (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 50,
      backgroundColor: 'var(--vscode-notifications-background, #4caf50)',
      color: 'var(--vscode-notifications-foreground, #ffffff)',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <CheckCircle size={24} />
      <span style={{ fontWeight: '500' }}>
        {showSuccess === 'documentation' ? 'Documentation generated successfully!' : 'Analysis complete!'}
      </span>
    </div>
  ) : null
);

export default Notification;