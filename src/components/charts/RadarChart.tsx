import React from 'react';
import type { HollandCode } from '../../types';

interface RadarChartProps {
  scores: Record<HollandCode, number>;
  maxScore?: number;
  size?: number;
}

const CATEGORIES: { code: HollandCode; label: string }[] = [
  { code: 'R', label: 'R - Kỹ thuật' },
  { code: 'I', label: 'I - Nghiên cứu' },
  { code: 'A', label: 'A - Nghệ thuật' },
  { code: 'S', label: 'S - Xã hội' },
  { code: 'E', label: 'E - Quản lý' },
  { code: 'C', label: 'C - Nghiệp vụ' },
];

export const RadarChart: React.FC<RadarChartProps> = ({
  scores,
  maxScore = 2,
  size = 260,
}) => {
  const center = size / 2;
  const radius = size * 0.36;
  const angleStep = (Math.PI * 2) / 6;

  // Level grid circles (3 levels: 0.33, 0.66, 1.0)
  const levels = [0.33, 0.66, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    // Start from top (- PI / 2)
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build polygon path for user data
  const dataPoints = CATEGORIES.map((cat, idx) => {
    const rawVal = scores[cat.code] || 0;
    const ratio = Math.max(0.1, Math.min(1.0, rawVal / maxScore));
    return getCoordinates(idx, ratio);
  });

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background grids */}
        {levels.map((lvl, lIdx) => {
          const gridPoints = CATEGORIES.map((_, idx) => getCoordinates(idx, lvl));
          const gridPath = gridPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={lIdx}
              d={gridPath}
              fill={lIdx === levels.length - 1 ? '#F8FAFC' : 'none'}
              stroke="#E2E8F0"
              strokeWidth={1}
            />
          );
        })}

        {/* Axes lines */}
        {CATEGORIES.map((_, idx) => {
          const p = getCoordinates(idx, 1.0);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#E2E8F0"
              strokeWidth={1.2}
              strokeDasharray="2,2"
            />
          );
        })}

        {/* User Data Polygon */}
        <path
          d={polygonPath}
          fill="rgba(37, 99, 235, 0.22)"
          stroke="#2563EB"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#FFFFFF"
            stroke="#2563EB"
            strokeWidth={2.5}
          />
        ))}

        {/* Labels */}
        {CATEGORIES.map((cat, idx) => {
          const p = getCoordinates(idx, 1.25);
          return (
            <text
              key={cat.code}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#1E293B"
              fontSize={11}
              fontWeight={600}
            >
              {cat.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

