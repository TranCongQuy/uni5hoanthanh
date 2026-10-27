import React from 'react';

interface DonutChartProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showSubtitle?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  percent,
  size = 64,
  strokeWidth = 6,
  color,
  showSubtitle = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.max(0, Math.min(100, percent));
  const offset = circumference - (safePercent / 100) * circumference;

  let strokeColor = color;
  if (!strokeColor) {
    if (safePercent >= 80) strokeColor = '#10B981';
    else if (safePercent >= 45) strokeColor = '#F59E0B';
    else strokeColor = '#EF4444';
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: size >= 60 ? '14px' : '12px',
            color: '#0F172A',
          }}
        >
          {safePercent}%
        </div>
      </div>
      {showSubtitle && (
        <span style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
          ước tính
        </span>
      )}
    </div>
  );
};

