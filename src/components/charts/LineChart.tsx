import React from 'react';

interface DataPoint {
  month: string;
  score: number;
}

interface LineChartProps {
  data?: DataPoint[];
  height?: number;
}

const DEFAULT_DATA: DataPoint[] = [
  { month: 'T9', score: 620 },
  { month: 'T10', score: 680 },
  { month: 'T11', score: 710 },
  { month: 'T12', score: 760 },
  { month: 'T1', score: 810 },
  { month: 'T2', score: 855 },
];

export const LineChart: React.FC<LineChartProps> = ({
  data = DEFAULT_DATA,
  height = 140,
}) => {
  const width = 320;
  const paddingX = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const minScore = 550;
  const maxScore = 950;

  const getCoordinates = (index: number, score: number) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y =
      paddingTop +
      (1 - (score - minScore) / (maxScore - minScore)) *
        (height - paddingTop - paddingBottom);
    return { x, y };
  };

  const points = data.map((d, i) => getCoordinates(i, d.score));

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - paddingBottom} L ${points[0].x.toFixed(1)} ${height - paddingBottom} Z`;

  return (
    <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[600, 750, 900].map((levelScore) => {
          const y =
            paddingTop +
            (1 - (levelScore - minScore) / (maxScore - minScore)) *
              (height - paddingTop - paddingBottom);
          return (
            <g key={levelScore}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <text
                x={paddingX - 6}
                y={y + 3}
                fontSize={9}
                fill="#94A3B8"
                textAnchor="end"
              >
                {levelScore}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#2563EB"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points and Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#FFFFFF"
              stroke="#2563EB"
              strokeWidth={2.5}
            />
            {/* Score above dot */}
            <text
              x={p.x}
              y={p.y - 8}
              fontSize={10}
              fontWeight={600}
              fill="#1E293B"
              textAnchor="middle"
            >
              {data[idx].score}
            </text>
            {/* Month label below */}
            <text
              x={p.x}
              y={height - 10}
              fontSize={10}
              fill="#64748B"
              textAnchor="middle"
            >
              {data[idx].month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

