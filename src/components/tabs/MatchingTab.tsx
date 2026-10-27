import React, { useState } from 'react';
import {
  Edit2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { evaluateMatching, GROUP_META } from '../../services/MatchingService';
import type { EvaluationGroup, GroupType, MatchResult } from '../../types';
import { Button, UniversityAvatar, AppFooter } from '../common/UI';
import { DonutChart } from '../charts/DonutChart';

export const MatchingTab: React.FC = () => {
  const {
    profile,
    hollandResult,
    openUniDetail,
    openBookConsultation,
  } = useApp();

  const [score, setScore] = useState<number>(profile.expectedScore || 24.5);
  const [budget, setBudget] = useState<number>(30); // Triệu / năm
  const [region, setRegion] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'score' | 'budget' | 'location'>('score');

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(true);
  const [isEditingParams, setIsEditingParams] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Evaluate matching results
  const evaluation: EvaluationGroup = evaluateMatching(
    score,
    budget,
    hollandResult?.primaryCode || '',
    region
  );

  const handleEvaluate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasEvaluated(true);
      setIsEditingParams(false);
    }, 600);
  };

  // Sort list inside each group
  const sortResults = (list: MatchResult[]) => {
    return [...list].sort((a, b) => {
      if (sortBy === 'score') {
        return b.matchingPercent - a.matchingPercent;
      }
      if (sortBy === 'budget') {
        return a.university.tuitionMin - b.university.tuitionMin;
      }
      // location
      return a.university.region.localeCompare(b.university.region);
    });
  };

  return (
    <div style={{ padding: '20px 20px 104px', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header & Desc */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
          Phân tích cơ hội trúng tuyển
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: 1.4 }}>
          Thuật toán AI đối soát điểm thi THPT, ngân sách học phí và nhóm tính cách với 30 trường đại học.
        </p>
      </div>

      {/* 2. Parameters Card: Full or Collapsed */}
      {!isEditingParams && hasEvaluated ? (
        /* Collapsed Summary Card */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '14px 18px',
            border: '1.5px solid #DBEAFE',
            boxShadow: '0 2px 10px rgba(37,99,235,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#2563EB',
                backgroundColor: '#EFF6FF',
                padding: '4px 10px',
                borderRadius: '10px',
              }}
            >
              {score.toFixed(1)} điểm
            </span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '4px 10px',
                borderRadius: '10px',
              }}
            >
              ≤ {budget} tr/năm
            </span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748B',
              }}
            >
              {region === 'Tất cả' ? 'Toàn quốc' : `Miền ${region}`}
            </span>
          </div>

          <button
            onClick={() => setIsEditingParams(true)}
            style={{
              border: 'none',
              backgroundColor: '#F1F5F9',
              padding: '8px 14px',
              borderRadius: '14px',
              color: '#2563EB',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
            }}
          >
            <Edit2 size={14} /> Sửa
          </button>
        </div>
      ) : (
        /* Full Input Card */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            marginBottom: '24px',
          }}
        >
          {/* Row 1: Expected Score */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>
                Điểm thi THPT dự kiến
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#2563EB' }}>
                  {score.toFixed(1)}
                </span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>điểm</span>
              </div>
            </div>
            <input
              type="range"
              min={15}
              max={30}
              step={0.1}
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                accentColor: '#2563EB',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              <span>15.0</span>
              <span>22.5</span>
              <span>30.0</span>
            </div>
          </div>

          {/* Row 2: Tuition Budget */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>
                Ngân sách học phí tối đa
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#10B981' }}>
                  {budget}
                </span>
                <span style={{ fontSize: '14px', color: '#64748B' }}>triệu/năm</span>
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                accentColor: '#10B981',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
              <span>10 tr</span>
              <span>35 tr</span>
              <span>60 tr</span>
            </div>
          </div>

          {/* Row 3: Priority Region */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', display: 'block', marginBottom: '8px' }}>
              Khu vực ưu tiên
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                backgroundColor: '#F1F5F9',
                padding: '4px',
                borderRadius: '16px',
              }}
            >
              {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((reg) => {
                const active = region === reg;
                return (
                  <button
                    key={reg}
                    onClick={() => setRegion(reg)}
                    style={{
                      height: '36px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: active ? '#2563EB' : 'transparent',
                      color: active ? '#FFFFFF' : '#475569',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button: Pill Red 52dp */}
          <Button
            variant="danger"
            size="L"
            fullWidth
            loading={loading}
            onClick={handleEvaluate}
          >
            Phân tích cơ hội đỗ ngay →
          </Button>
        </div>
      )}

      {/* 3. Sorting Tabs (Điểm số / Ngân sách / Vị trí) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
          Sắp xếp kết quả theo:
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'score', label: 'Điểm số' },
            { id: 'budget', label: 'Ngân sách' },
            { id: 'location', label: 'Vị trí' },
          ].map((tab) => {
            const active = sortBy === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id as 'score' | 'budget' | 'location')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '14px',
                  backgroundColor: active ? '#2563EB' : '#F1F5F9',
                  color: active ? '#FFFFFF' : '#64748B',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Results by 3 Probability Groups */}
      {[
        { type: 'SAFE' as GroupType, list: sortResults(evaluation.safeList) },
        { type: 'MODERATE' as GroupType, list: sortResults(evaluation.moderateList) },
        { type: 'CHALLENGING' as GroupType, list: sortResults(evaluation.challengingList) },
      ].map(({ type, list }) => {
        const meta = GROUP_META[type];

        return (
          <div key={type} style={{ marginBottom: '24px' }}>
            {/* Group Header Badge */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: meta.color,
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '14px',
                  }}
                >
                  {meta.title} ({list.length})
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748B', paddingLeft: '4px' }}>
                {meta.description}
              </span>
            </div>

            {/* University Cards */}
            {list.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: '#94A3B8',
                  border: '1px dashed #E2E8F0',
                }}
              >
                Không có trường nào thuộc nhóm này theo tiêu chí lọc
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {list.map((item) => (
                  <div
                    key={item.university.id}
                    onClick={() => openUniDetail(item.university.id)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '14px 16px',
                      border: '1px solid #E2E8F0',
                      borderLeft: `5px solid ${meta.color}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <UniversityAvatar code={item.university.code} size={50} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          lineHeight: 1.25,
                        }}
                      >
                        {item.university.name}
                      </div>

                      <div
                        style={{
                          fontSize: '12px',
                          color: '#2563EB',
                          fontWeight: 600,
                          marginTop: '3px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.matchedMajor} (Chuẩn: {item.majorCutoff}đ)
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '11px',
                          color: '#64748B',
                          marginTop: '3px',
                        }}
                      >
                        <span>{item.university.loc.split(',')[0]}</span>
                        <span>•</span>
                        <span>{item.university.tuitionMin}-{item.university.tuitionMax} tr/năm</span>
                      </div>
                    </div>

                    {/* Donut Chart with matching percentage */}
                    <div style={{ flexShrink: 0 }}>
                      <DonutChart
                        percent={item.matchingPercent}
                        color={meta.color}
                        size={56}
                        strokeWidth={5}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* 5. Bottom note & Book 1-1 Consultation Button */}
      <div
        style={{
          backgroundColor: '#FFFBEB',
          borderRadius: '16px',
          padding: '12px 16px',
          border: '1px solid #FDE68A',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#92400E', lineHeight: 1.4, display: 'block' }}>
          * Chú thích: Tỷ lệ phần trăm là ước tính dựa trên dữ liệu điểm chuẩn tham khảo các năm trước, không phải xác suất trúng tuyển tuyệt đối đã kiểm chứng.
        </span>
      </div>

      <Button
        variant="danger"
        size="L"
        fullWidth
        icon={<Calendar size={18} />}
        onClick={() => openBookConsultation()}
      >
        Đặt lịch tư vấn 1-1 với chuyên gia tuyển sinh
      </Button>

      <AppFooter text="Thuật toán Matching được phát triển độc quyền bởi Unipath." />
    </div>
  );
};
