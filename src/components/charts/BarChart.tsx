import React from 'react';

interface BarChartProps {
  score2022: number;
  score2023: number;
  score2024: number;
  userScore: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  score2022,
  score2023,
  score2024,
  userScore,
}) => {
  const bars = [
    { label: '2022', score: score2022, isUser: false },
    { label: '2023', score: score2023, isUser: false },
    { label: '2024', score: score2024, isUser: false },
    { label: 'Của bạn', score: userScore, isUser: true },
  ];

  const MAX_SCORE = 30;
  const TRACK_HEIGHT = 110; // Explicit pixel height

  return (
    <div
      style={{
        width: '100%',
        padding: '16px 14px 14px',
        backgroundColor: '#F8FAFC',
        borderRadius: '20px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
            Biến động điểm chuẩn 3 năm gần nhất
          </span>
        </div>
        <span
          style={{
            fontSize: '11px',
            color: '#2563EB',
            fontWeight: 700,
            backgroundColor: '#EFF6FF',
            padding: '2px 8px',
            borderRadius: '8px',
          }}
        >
          Thang 30 điểm
        </span>
      </div>

      {/* Chart Canvas with explicit pixel height */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          height: `${TRACK_HEIGHT + 44}px`,
          alignItems: 'end',
          position: 'relative',
          paddingTop: '10px',
        }}
      >
        {/* Background baseline reference line */}
        <div
          style={{
            position: 'absolute',
            bottom: '26px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: '#E2E8F0',
          }}
        />

        {bars.map((bar, idx) => {
          // Explicit pixel height calculation: guarantees bar is NEVER 0px
          const barPx = Math.max(18, Math.round((Math.min(bar.score, MAX_SCORE) / MAX_SCORE) * TRACK_HEIGHT));

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Score Value Label on Top of Bar */}
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: bar.isUser ? '#059669' : '#1E3A8A',
                  marginBottom: '6px',
                }}
              >
                {bar.score.toFixed(1)}
              </span>

              {/* Solid Vertical Bar with Explicit Pixel Height & Gradient */}
              <div
                style={{
                  width: '38px',
                  height: `${barPx}px`,
                  background: bar.isUser
                    ? 'linear-gradient(180deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                  borderRadius: '10px 10px 4px 4px',
                  boxShadow: bar.isUser
                    ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                    : '0 4px 12px rgba(37, 99, 235, 0.25)',
                  transition: 'height 0.4s ease',
                  border: bar.isUser ? '1.5px solid #A7F3D0' : '1.5px solid #BFDBFE',
                  borderBottom: 'none',
                }}
              />

              {/* Year / Label below */}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: bar.isUser ? 800 : 600,
                  color: bar.isUser ? '#059669' : '#64748B',
                  marginTop: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                {bar.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
