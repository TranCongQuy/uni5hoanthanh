import React, { useState, useEffect } from 'react';
import {
  Edit2,
  Bot,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { evaluateMatching, GROUP_META } from '../../services/MatchingService';
import type { EvaluationGroup, GroupType, MatchResult } from '../../types';
import { Button, UniversityAvatar, AppFooter } from '../common/UI';
import { DonutChart } from '../charts/DonutChart';

export const MatchingTab: React.FC = () => {
  const {
    hollandResult,
    openUniDetail,
    openChatBot,
    setActiveTab,
    aiMatchState,
    saveAIMatchState,
  } = useApp();

  // Initial parameters: load from latest remembered analysis or default to min
  const [score, setScore] = useState<number>(aiMatchState.score ?? 15.0); // Min: 15.0
  const [budget, setBudget] = useState<number>(aiMatchState.budget ?? 10); // Min: 10 Triệu / năm
  const [region, setRegion] = useState<string>(aiMatchState.region ?? 'Tất cả');
  const [sortBy, setSortBy] = useState<'score' | 'budget' | 'location'>(aiMatchState.sortBy ?? 'score');

  const [hasEvaluated, setHasEvaluated] = useState<boolean>(aiMatchState.hasEvaluated ?? false);
  const [isEditingParams, setIsEditingParams] = useState<boolean>(!aiMatchState.hasEvaluated);
  const [loading, setLoading] = useState<boolean>(false);

  // Synchronize when aiMatchState is reset (e.g. fresh demo login)
  useEffect(() => {
    setScore(aiMatchState.score ?? 15.0);
    setBudget(aiMatchState.budget ?? 10);
    setRegion(aiMatchState.region ?? 'Tất cả');
    setSortBy(aiMatchState.sortBy ?? 'score');
    setHasEvaluated(aiMatchState.hasEvaluated ?? false);
    setIsEditingParams(!aiMatchState.hasEvaluated);
  }, [aiMatchState]);

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
      saveAIMatchState({
        hasEvaluated: true,
        score,
        budget,
        region,
        sortBy,
        analyzedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      });
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

      {/* 2. Notice Banner: Holland RIASEC integration */}
      <div
        style={{
          backgroundColor: hollandResult ? '#EFF6FF' : '#FFFBEB',
          border: `1.5px solid ${hollandResult ? '#BFDBFE' : '#FCD34D'}`,
          borderRadius: '20px',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: hollandResult ? '#DBEAFE' : '#FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hollandResult ? '#2563EB' : '#D97706',
            flexShrink: 0,
          }}
        >
          <Sparkles size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: hollandResult ? '#1E40AF' : '#92400E',
              marginBottom: '3px',
            }}
          >
            {hollandResult
              ? `✅ Đã tích hợp kết quả Holland nhóm [${hollandResult.primaryCode}]`
              : '💡 Lưu ý: Tăng tỉ lệ dự đoán trường phù hợp lên 98%'}
          </div>
          <div style={{ fontSize: '12px', color: hollandResult ? '#1E3A8A' : '#78350F', lineHeight: 1.45 }}>
            {hollandResult ? (
              <>Thuật toán AI đã kết hợp đối soát nhóm tính cách của bạn để đề xuất đúng ngành học thế mạnh.</>
            ) : (
              <>
                Học sinh sau khi <strong>hoàn thành bài khảo sát trắc nghiệm Holland RIASEC</strong> sẽ giúp thuật toán AI phân tích sở thích nghề nghiệp, nâng cao tỉ lệ dự đoán trường và ngành học phù hợp lên tới <strong>98%</strong>!
              </>
            )}
          </div>
          {!hollandResult && (
            <button
              onClick={() => setActiveTab(1)}
              style={{
                marginTop: '8px',
                border: 'none',
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
              }}
            >
              Làm khảo sát tính cách ngay <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Parameters Card: Full or Collapsed */}
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
            <Edit2 size={14} /> Sửa tiêu chí
          </button>
        </div>
      ) : (
        /* Full Input Card */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '20px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Thiết lập thông tin dự đoán AI
            </h3>
            {hasEvaluated && (
              <button
                onClick={() => setIsEditingParams(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
            )}
          </div>

          {/* Row 1: Expected Score (Decorated dynamic slider) */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                  Điểm thi THPT dự kiến
                </span>
                <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                  {score < 18 ? '🎯 Mức cơ bản (Xét tuyển trường địa phương)' : score < 22 ? '🚀 Mức khá (Cơ hội vào nhiều trường tốt)' : score < 26 ? '🌟 Mức giỏi (Vào các trường Top đầu)' : '🏆 Mức xuất sắc (Thủ khoa / Y Dược / Bách Khoa)'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '30px', fontWeight: 900, color: '#2563EB', letterSpacing: '-0.5px' }}>
                  {score.toFixed(1)}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>điểm</span>
              </div>
            </div>

            {/* Slider with dynamic gradient track */}
            <input
              type="range"
              min={15}
              max={30}
              step={0.1}
              value={score}
              onChange={(e) => setScore(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '6px',
                background: `linear-gradient(to right, #2563EB 0%, #3B82F6 ${((score - 15) / 15) * 100}%, #E2E8F0 ${((score - 15) / 15) * 100}%, #E2E8F0 100%)`,
                outline: 'none',
                cursor: 'pointer',
                accentColor: '#2563EB',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
              <span style={{ fontWeight: score === 15 ? 800 : 500, color: score === 15 ? '#2563EB' : '#94A3B8' }}>15.0 (Thấp nhất)</span>
              <span>22.5</span>
              <span style={{ fontWeight: score === 30 ? 800 : 500, color: score === 30 ? '#2563EB' : '#94A3B8' }}>30.0 (Tối đa)</span>
            </div>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[15.0, 18.5, 21.0, 24.5, 27.0, 30.0].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setScore(p)}
                  style={{
                    border: score === p ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: score === p ? '#EFF6FF' : '#F8FAFC',
                    color: score === p ? '#2563EB' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {p.toFixed(1)}đ
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Tuition Budget (Decorated dynamic slider) */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                  Ngân sách học phí tối đa
                </span>
                <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 700, marginTop: '2px' }}>
                  {budget <= 15 ? '🍃 Mức tiết kiệm & Có học bổng cao' : budget <= 30 ? '⚖️ Đại học công lập tiêu chuẩn' : budget <= 45 ? '🏢 Tư thục & Đào tạo chất lượng cao' : '💎 Quốc tế & Liên kết nước ngoài'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '30px', fontWeight: 900, color: '#10B981', letterSpacing: '-0.5px' }}>
                  {budget}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>triệu/năm</span>
              </div>
            </div>

            {/* Slider with dynamic gradient track */}
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '10px',
                borderRadius: '6px',
                background: `linear-gradient(to right, #10B981 0%, #059669 ${((budget - 10) / 50) * 100}%, #E2E8F0 ${((budget - 10) / 50) * 100}%, #E2E8F0 100%)`,
                outline: 'none',
                cursor: 'pointer',
                accentColor: '#10B981',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
              <span style={{ fontWeight: budget === 10 ? 800 : 500, color: budget === 10 ? '#10B981' : '#94A3B8' }}>10 tr (Thấp nhất)</span>
              <span>35 tr</span>
              <span style={{ fontWeight: budget === 60 ? 800 : 500, color: budget === 60 ? '#10B981' : '#94A3B8' }}>60 tr (Tối đa)</span>
            </div>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
              {[10, 20, 30, 45, 60].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  style={{
                    border: budget === b ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                    backgroundColor: budget === b ? '#ECFDF5' : '#F8FAFC',
                    color: budget === b ? '#059669' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {b} tr/năm
                </button>
              ))}
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
            {hasEvaluated ? 'Cập nhật phân tích mới →' : '🚀 Phân tích cơ hội trúng tuyển ngay →'}
          </Button>
        </div>
      )}

      {/* Conditionally show results only after user clicks analyze */}
      {!hasEvaluated ? (
        <div
          style={{
            padding: '36px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            textAlign: 'center',
            border: '1.5px dashed #CBD5E1',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
              margin: '0 auto 12px',
            }}
          >
            <HelpCircle size={30} />
          </div>
          <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
            Chưa có dữ liệu phân tích
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
            Vui lòng chọn mức điểm dự kiến, ngân sách học phí và bấm nút <strong>"Phân tích cơ hội trúng tuyển ngay"</strong> phía trên để AI đối soát và phân nhóm 30 trường đại học!
          </p>
        </div>
      ) : (
        <>
          {/* 4. Sorting Tabs (Điểm số / Ngân sách / Vị trí) */}
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
                    onClick={() => {
                      const nextSort = tab.id as 'score' | 'budget' | 'location';
                      setSortBy(nextSort);
                      saveAIMatchState({ sortBy: nextSort });
                    }}
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

          {/* 5. Results by 3 Probability Groups */}
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
        </>
      )}

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
        variant="primary"
        size="L"
        fullWidth
        icon={<Bot size={18} />}
        onClick={() => openChatBot()}
      >
        Trò chuyện cùng Trợ lý AI để chọn trường chuẩn →
      </Button>

      <AppFooter text="Thuật toán Matching được phát triển độc quyền bởi Unipath." />
    </div>
  );
};
