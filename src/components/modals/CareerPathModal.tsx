import React, { useState } from 'react';
import { X, Compass, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCareerPath } from '../../data/CareerPathData';
import { HOLLAND_NAMES } from '../../data/MockData';
import type { HollandCode } from '../../types';
import { Button, ImageSafe } from '../common/UI';

export const CareerPathModal: React.FC = () => {
  const {
    isCareerPathOpen,
    closeCareerPath,
    selectedCareerCode,
    setActiveTab,
  } = useApp();

  const [activeCode, setActiveCode] = useState<HollandCode>(selectedCareerCode || 'E');

  if (!isCareerPathOpen) return null;

  const pathInfo = getCareerPath(activeCode);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={closeCareerPath}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Lộ trình Phát triển THPT
            </h3>
          </div>
          <button
            onClick={closeCareerPath}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 100px' }}>
          {/* Header Graphic */}
          <div
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              height: '130px',
              backgroundColor: '#2563EB',
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            <ImageSafe
              src="/images/career_header.png"
              fallbackSrc="/images/slide_edufair.png"
              altText="Career Path Header"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(30,58,138,0.85) 0%, rgba(30,58,138,0.4) 100%)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#93C5FD' }}>
                ĐỊNH HƯỚNG NGHỀ NGHIỆP THPT
              </span>
              <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 800 }}>
                Chiến lược 3 năm vào Đại học
              </h3>
            </div>
          </div>

          {/* Holland Tabs Selector (R, I, A, S, E, C) */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
            {(['R', 'I', 'A', 'S', 'E', 'C'] as HollandCode[]).map((code) => {
              const active = activeCode === code;
              return (
                <button
                  key={code}
                  onClick={() => setActiveCode(code)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '16px',
                    backgroundColor: active ? '#2563EB' : '#F1F5F9',
                    color: active ? '#FFFFFF' : '#475569',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  Nhóm {code}
                </button>
              );
            })}
          </div>

          {/* Path Header Info */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '20px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #DBEAFE',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
              Mã {pathInfo.hollandCode} — {HOLLAND_NAMES[pathInfo.hollandCode]}
            </div>
            <h4 style={{ margin: '4px 0 6px', fontSize: '17px', fontWeight: 800, color: '#1E3A8A' }}>
              {pathInfo.title}
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#3B82F6', lineHeight: 1.4 }}>
              {pathInfo.subtitle}
            </p>
          </div>

          {/* Core Skills Chips */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              Kỹ năng cốt lõi cần tôi luyện:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {pathInfo.coreSkills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    backgroundColor: '#F1F5F9',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ★ {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Timeline: Grade 10, 11, 12 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            {/* Grade 10 */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  10
                </div>
                <div style={{ width: '2px', flex: 1, backgroundColor: '#E2E8F0', marginTop: '6px' }} />
              </div>

              <div style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0' }}>
                <h5 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                  Lớp 10 — Xây dựng nền tảng & Khám phá
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {pathInfo.grade10Milestones.map((m, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grade 11 */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  11
                </div>
                <div style={{ width: '2px', flex: 1, backgroundColor: '#E2E8F0', marginTop: '6px' }} />
              </div>

              <div style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0' }}>
                <h5 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                  Lớp 11 — Tăng tốc kỹ năng & Hồ sơ năng lực
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {pathInfo.grade11Milestones.map((m, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Grade 12 */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  12
                </div>
              </div>

              <div style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0' }}>
                <h5 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                  Lớp 12 — Bứt phá thi cử & Đăng ký nguyện vọng
                </h5>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {pathInfo.grade12Milestones.map((m, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Certifications */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid #FDE68A',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Award size={18} color="#D97706" />
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#92400E' }}>
                Chứng chỉ quốc tế khuyên dùng:
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {pathInfo.recommendedCerts.map((cert, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FCD34D',
                    color: '#B45309',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '10px',
                  }}
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed CTA button */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <Button
            variant="primary"
            size="L"
            fullWidth
            onClick={() => {
              closeCareerPath();
              setActiveTab(2);
            }}
          >
            Xem các trường đào tạo nhóm này →
          </Button>
        </div>
      </div>
    </div>
  );
};
