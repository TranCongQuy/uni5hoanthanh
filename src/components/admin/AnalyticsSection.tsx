import React from 'react';
import {
  TrendingUp,
  MapPin,
  Filter,
  BarChart2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { ApplicationRecord, University } from '../../types';
import {
  getApplicationsByRegion,
  getAdmissionFunnel,
  getScoreHistogram,
  getDailySubmissionTimeline,
} from '../../services/AdminAnalyticsService';

interface AnalyticsSectionProps {
  applications: ApplicationRecord[];
  universities: University[];
  isDesktop: boolean;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  applications,
  universities,
  isDesktop,
}) => {
  const regions = getApplicationsByRegion(applications, universities);
  const funnel = getAdmissionFunnel(applications);
  const histogram = getScoreHistogram(applications);
  const timeline = getDailySubmissionTimeline(applications, 14);

  const totalApps = applications.length;
  const maxHistogramCount = Math.max(...histogram.map((h) => h.count), 1);
  const maxTimelineCount = Math.max(...timeline.map((t) => t.count), 1);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    border: '1px solid #E2E8F0',
    padding: '24px',
    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #050B14 0%, #0B132B 50%, #1C2541 100%)',
          borderRadius: '22px',
          padding: '26px 30px',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(5, 11, 20, 0.35)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '4px 10px',
              borderRadius: '999px',
              color: '#38BDF8',
              fontSize: '11.5px',
              fontWeight: 800,
              marginBottom: '10px',
            }}
          >
            <Sparkles size={13} />
            <span>TRUNG TÂM PHÂN TÍCH TUYỂN SINH QUỐC GIA 2026</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 900, letterSpacing: '-0.4px' }}>
            Báo cáo Toàn cảnh Dữ liệu Tuyển sinh Toàn diện
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#94A3B8', maxWidth: '720px', lineHeight: 1.5 }}>
            Phân bổ thí sinh theo 3 miền địa lý, tỷ lệ chuyển đổi qua 5 giai đoạn phễu xét tuyển, phổ điểm kỳ vọng và xu hướng nộp hồ sơ theo thời gian thực.
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns on Desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(2, 1fr)' : '1fr',
          gap: '20px',
        }}
      >
        {/* 1. Region Distribution */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Phân bổ Hồ sơ theo 3 Miền
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Đối soát trên {totalApps} hồ sơ hiện hữu
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '8px' }}>
              100% Khớp miền
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {regions.map((reg) => {
              const color = reg.region === 'Bắc' ? '#2563EB' : reg.region === 'Trung' ? '#059669' : '#7C3AED';
              return (
                <div key={reg.region}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#1E293B' }}>Miền {reg.region}</span>
                    <span className="tabular-nums" style={{ fontWeight: 800, color }}>
                      {reg.count} hồ sơ ({reg.percentage}%)
                    </span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${reg.percentage}%`,
                        backgroundColor: color,
                        borderRadius: '999px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Admission Funnel */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Filter size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Phễu Tuyển sinh 5 Giai đoạn
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Luồng xét duyệt từ nộp mới đến trúng tuyển
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '8px' }}>
              5 Trạng thái
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {funnel.map((fn, idx) => {
              const pct = totalApps > 0 ? Math.round((fn.count / totalApps) * 100) : 0;
              return (
                <div
                  key={fn.stage}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: idx === 2 ? '#F0FDF4' : '#F8FAFC',
                    border: idx === 2 ? '1px solid #BBF7D0' : '1px solid #F1F5F9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', width: '18px' }}>
                      0{idx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: idx === 2 ? '#166534' : '#1E293B' }}>
                      {fn.stage}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 800, color: idx === 2 ? '#059669' : '#0F172A' }}>
                      {fn.count} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Score Distribution Histogram */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Phổ điểm Hồ sơ Thí sinh
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Phân bố điểm dự kiến theo thang điểm 30
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#9333EA', backgroundColor: '#FAF5FF', padding: '3px 8px', borderRadius: '8px' }}>
              5 Phân khúc
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px', gap: '12px' }}>
            {histogram.map((h) => {
              const heightPct = Math.max((h.count / maxHistogramCount) * 100, 6);
              return (
                <div key={h.range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }} className="tabular-nums">
                    {h.count}
                  </div>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div
                      style={{
                        width: '70%',
                        height: `${heightPct}%`,
                        backgroundColor:
                          h.range === '≥ 28đ'
                            ? '#8B5CF6'
                            : h.range === '26 – 28đ'
                            ? '#6366F1'
                            : h.range === '24 – 26đ'
                            ? '#3B82F6'
                            : '#94A3B8',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.5s ease',
                      }}
                      title={`${h.range}: ${h.count} hồ sơ (${h.percentage}%)`}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {h.range}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Daily Submission Timeline */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  Tiến độ Nộp Hồ sơ Theo Ngày
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Dòng thời gian các đợt nộp hồ sơ gần nhất
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
              <TrendingUp size={14} />
              <span>Liên tục cập nhật</span>
            </div>
          </div>

          {timeline.length === 0 ? (
            <div style={{ padding: '36px 0', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
              Chưa có dữ liệu ngày nộp hồ sơ
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '20px', gap: '6px' }}>
              {timeline.map((t) => {
                const heightPct = Math.max((t.count / maxTimelineCount) * 100, 10);
                return (
                  <div key={t.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }} className="tabular-nums">
                      {t.count}
                    </div>
                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div
                        style={{
                          width: '60%',
                          height: `${heightPct}%`,
                          backgroundColor: '#059669',
                          borderRadius: '4px 4px 0 0',
                          opacity: 0.85,
                        }}
                        title={`Ngày ${t.label}: ${t.count} hồ sơ`}
                      />
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '6px', textAlign: 'center' }}>
                      {t.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
