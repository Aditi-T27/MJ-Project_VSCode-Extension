import React from 'react';
import { TrendingUp, Clock, Zap } from 'lucide-react';

interface StatsBarProps {
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  endpointsLength: number;
  cardStyle: React.CSSProperties;
}

const StatsBar: React.FC<StatsBarProps> = ({
  successCount, avgResponseTime, endpointsLength, cardStyle
}) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '24px'
  }}>
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: 'var(--vscode-descriptionForeground, #999999)'
          }}>Success Rate</p>
          <p style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--vscode-testing-iconPassed, #4caf50)'
          }}>
            {Math.round((successCount / endpointsLength) * 100)}%
          </p>
        </div>
        <TrendingUp size={32} color="var(--vscode-testing-iconPassed, #4caf50)" />
      </div>
    </div>
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: 'var(--vscode-descriptionForeground, #999999)'
          }}>Avg Response</p>
          <p style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--vscode-charts-blue, #007acc)'
          }}>
            {avgResponseTime}ms
          </p>
        </div>
        <Clock size={32} color="var(--vscode-charts-blue, #007acc)" />
      </div>
    </div>
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            margin: '0 0 4px 0',
            fontSize: '14px',
            color: 'var(--vscode-descriptionForeground, #999999)'
          }}>Total Endpoints</p>
          <p style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'var(--vscode-charts-purple, #bc5fd4)'
          }}>
            {endpointsLength}
          </p>
        </div>
        <Zap size={32} color="var(--vscode-charts-purple, #bc5fd4)" />
      </div>
    </div>
  </div>
);

export default StatsBar;