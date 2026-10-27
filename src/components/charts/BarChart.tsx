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

  const maxVal = Math.max(30, ...bars.map((b) => b.score));

  return (
    <div style={{ width: '100%', padding: '16px 12px 10px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
          Biến động điểm chuẩn 3 năm gần nhất
        </span>
        <span style={{ fontSize: '11px', color: '#64748B' }}>Thang 30</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '120px', gap: '8px' }}>
        {bars.map((bar, idx) => {
          const heightPercent = Math.max(15, Math.min(100, (bar.score / maxVal) * 100));
          const barColor = bar.isUser ? '#10B981' : '#2563EB';

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: bar.isUser ? '#10B981' : '#1E293B',
                  marginBottom: '4px',
                }}
              >
                {bar.score.toFixed(1)}
              </span>
              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${heightPercent}%`,
                  backgroundColor: barColor,
                  borderRadius: '6px 6px 0 0',
                  boxShadow: bar.isUser ? '0 2px 6px rgba(16, 185, 129, 0.3)' : '0 2px 6px rgba(37, 99, 235, 0.2)',
                  transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: bar.isUser ? 700 : 500,
                  color: bar.isUser ? '#10B981' : '#64748B',
                  marginTop: '8px',
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

