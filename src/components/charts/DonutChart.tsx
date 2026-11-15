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
    if (safePercent >= 75) strokeColor = 'var(--up-status-admitted-text, #059669)';
    else if (safePercent >= 45) strokeColor = 'var(--up-student-primary, #4F46E5)';
    else strokeColor = 'var(--up-status-pending-text, #D97706)';
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
            stroke="var(--up-color-slate-200, #E2E8F0)"
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
          className="tabular-nums"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: size >= 60 ? '14px' : '12px',
            color: 'var(--up-color-slate-900, #0F172A)',
            fontFamily: 'var(--up-font-family)',
          }}
        >
          {safePercent}%
        </div>
      </div>
      {showSubtitle && (
        <span style={{ fontSize: '11px', color: 'var(--up-color-slate-500, #64748B)', marginTop: '2px' }}>
          ước tính
        </span>
      )}
    </div>
  );
};

