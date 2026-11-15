import React from 'react';
import type { HollandCode } from '../../types';

export interface RiasecBarChartProps {
  scores: Record<HollandCode, number>;
  maxScore?: number;
  highlightCodes?: HollandCode[];
  className?: string;
}

const RIASEC_META: Record<HollandCode, { label: string; shortDesc: string; color: string; bg: string }> = {
  R: { label: 'R — Kỹ thuật', shortDesc: 'Thực tế / Hành động', color: '#0284C7', bg: '#F0F9FF' },
  I: { label: 'I — Nghiên cứu', shortDesc: 'Tư duy / Phân tích', color: '#2563EB', bg: '#EFF6FF' },
  A: { label: 'A — Nghệ thuật', shortDesc: 'Sáng tạo / Tự do', color: '#7C3AED', bg: '#F5F3FF' },
  S: { label: 'S — Xã hội', shortDesc: 'Giúp đỡ / Giảng dạy', color: '#059669', bg: '#ECFDF5' },
  E: { label: 'E — Quản lý', shortDesc: 'Lãnh đạo / Thuyết phục', color: '#D97706', bg: '#FFFBEB' },
  C: { label: 'C — Nghiệp vụ', shortDesc: 'Quy chuẩn / Chi tiết', color: '#475569', bg: '#F1F5F9' },
};

const CODES: HollandCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const RiasecBarChart: React.FC<RiasecBarChartProps> = ({
  scores,
  maxScore = 6,
  highlightCodes = [],
  className = '',
}) => {
  const chartHeight = 140;

  return (
    <div
      className={`w-full rounded-2xl p-4 bg-white border border-slate-200 ${className}`}
      style={{
        boxShadow: 'var(--up-shadow-xs)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-800">
          Phân bố 6 nhóm năng lực RIASEC
        </span>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md tabular-nums">
          Thang 0–{maxScore} điểm
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          alignItems: 'end',
          height: `${chartHeight}px`,
          paddingTop: '20px',
          borderBottom: '1px solid var(--up-color-slate-200, #E2E8F0)',
        }}
      >
        {CODES.map((code) => {
          const score = Math.max(0, Math.min(maxScore, scores[code] ?? 0));
          const heightPercent = maxScore > 0 ? (score / maxScore) * 100 : 0;
          const barPx = Math.max(8, Math.round((heightPercent / 100) * (chartHeight - 32)));
          const isTop = highlightCodes.includes(code);
          const meta = RIASEC_META[code];

          return (
            <div
              key={code}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
              }}
            >
              {/* Score Value on Top */}
              <span
                className="tabular-nums"
                style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: isTop ? meta.color : 'var(--up-color-slate-700, #334155)',
                  marginBottom: '4px',
                }}
              >
                {score}
              </span>

              {/* Column Bar with CSS animation */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '34px',
                  height: `${barPx}px`,
                  borderRadius: '6px 6px 2px 2px',
                  backgroundColor: isTop ? meta.color : 'var(--up-color-slate-300, #CBD5E1)',
                  boxShadow: isTop ? `0 2px 8px ${meta.color}40` : 'none',
                  transition: 'height var(--up-transition-smooth, 250ms ease), background-color 200ms ease',
                }}
                title={`${meta.label}: ${score}/${maxScore} điểm`}
              />
            </div>
          );
        })}
      </div>

      {/* Group Labels below bars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          marginTop: '8px',
          textAlign: 'center',
        }}
      >
        {CODES.map((code) => {
          const isTop = highlightCodes.includes(code);
          const meta = RIASEC_META[code];
          return (
            <div key={code} style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isTop ? meta.color : 'var(--up-color-slate-800, #1E293B)',
                }}
              >
                {code}
              </div>
              <div
                style={{
                  fontSize: '9.5px',
                  color: isTop ? meta.color : 'var(--up-color-slate-500, #64748B)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={meta.shortDesc}
              >
                {meta.label.split('—')[1]?.trim() || code}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
