import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Star,
  HelpCircle,
  X,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  QUIZ_QUESTIONS,
  HOLLAND_NAMES,
  HOLLAND_DESCRIPTIONS,
  HOLLAND_MAJORS,
  getHollandName,
} from '../../data/MockData';
import type { HollandCode } from '../../types';
import { Button, AppFooter } from '../common/UI';
import { RadarChart } from '../charts/RadarChart';

const OPTIONS = [
  {
    title: 'Rất thích / Hoàn toàn đúng',
    sub: 'Mức độ hứng thú và phù hợp cao nhất (+3)',
    score: 3,
    icon: <Star size={20} color="#F59E0B" />,
  },
  {
    title: 'Khá thích / Đúng phần lớn',
    sub: 'Phù hợp với sở trường và thói quen (+2)',
    score: 2,
    icon: <Sparkles size={20} color="#2563EB" />,
  },
  {
    title: 'Phân vân / Bình thường',
    sub: 'Chưa rõ ràng hoặc không thường xuyên (+1)',
    score: 1,
    icon: <HelpCircle size={20} color="#0D9488" />,
  },
  {
    title: 'Không thích / Không đúng',
    sub: 'Hoàn toàn không phù hợp (+0)',
    score: 0,
    icon: <X size={20} color="#94A3B8" />,
  },
];

export const QuizTab: React.FC = () => {
  const {
    hollandResult,
    saveHollandResult,
    clearHollandResult,
    setActiveTab,
    openCareerPath,
    reduceMotion,
  } = useApp();

  // Screen mode: 'intro' | 'taking' | 'result'
  const [mode, setMode] = useState<'intro' | 'taking' | 'result'>(() => {
    return hollandResult ? 'result' : 'intro';
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(12).fill(-1));
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Trigger confetti when entering result
  useEffect(() => {
    if (mode === 'result' && !reduceMotion) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [mode, reduceMotion]);

  // Start test
  const handleStart = () => {
    setCurrentIdx(0);
    setAnswers(new Array(12).fill(-1));
    setMode('taking');
  };

  // Select option for current question
  const handleSelectOption = (optIdx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIdx] = optIdx;
    setAnswers(nextAnswers);
  };

  // Go to next question or complete
  const handleNext = () => {
    if (answers[currentIdx] === -1) return;

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate Holland scores
      const scores: Record<HollandCode, number> = {
        R: 0,
        I: 0,
        A: 0,
        S: 0,
        E: 0,
        C: 0,
      };

      QUIZ_QUESTIONS.forEach((q, idx) => {
        const selectedOpt = answers[idx];
        if (selectedOpt !== -1) {
          scores[q.category] += OPTIONS[selectedOpt].score;
        }
      });

      saveHollandResult(scores);
      setMode('result');
    }
  };

  // Go to previous question
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      setShowExitConfirm(true);
    }
  };

  // Retake test
  const handleRetake = () => {
    clearHollandResult();
    setCurrentIdx(0);
    setAnswers(new Array(12).fill(-1));
    setMode('intro');
  };

  // --- 1. INTRO MODE ---
  if (mode === 'intro') {
    return (
      <div style={{ padding: '20px 20px 104px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Illustration Box 240dp */}
        <div
          style={{
            height: '240px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #BFDBFE',
            boxShadow: '0 8px 24px rgba(37,99,235,0.08)',
            marginBottom: '24px',
          }}
        >
          <img
            src="/images/quiz_intro_art.png"
            alt="Holland Quiz"
            style={{ width: '220px', height: '180px', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Title & Desc */}
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
          Khám phá tính cách của bạn
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '15px', color: '#64748B', lineHeight: 1.45 }}>
          Trắc nghiệm hướng nghiệp RIASEC tiêu chuẩn Hoa Kỳ giúp xác định xu hướng nghề nghiệp và gợi ý chuyên ngành đại học phù hợp nhất.
        </p>

        {/* 3 Stat Cards (88dp) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div
            style={{
              height: '88px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#2563EB' }}>12</span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>câu hỏi</span>
          </div>
          <div
            style={{
              height: '88px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#10B981' }}>5</span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>phút</span>
          </div>
          <div
            style={{
              height: '88px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B' }}>6</span>
            <span style={{ fontSize: '12px', color: '#64748B' }}>nhóm</span>
          </div>
        </div>

        {/* 3 Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
          {[
            'Biểu đồ Radar trực quan 6 nhóm tính cách RIASEC',
            'Gợi ý danh sách ngành học và trường ĐH phù hợp',
            'Lộ trình phát triển năng lực THPT 3 năm (Lớp 10-12)',
          ].map((benefit, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <span style={{ fontSize: '14px', color: '#1E293B', fontWeight: 500 }}>
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Fixed CTA button */}
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            left: 0,
            right: 0,
            padding: '12px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 40,
          }}
        >
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <Button fullWidth size="L" onClick={handleStart}>
              Bắt đầu làm bài →
            </Button>
          </div>
        </div>

        <AppFooter text="Kết quả mang tính tham khảo, không thay thế tư vấn chuyên môn." />
      </div>
    );
  }

  // --- 2. TAKING TEST MODE ---
  if (mode === 'taking') {
    const currentQ = QUIZ_QUESTIONS[currentIdx];
    const progressPercent = ((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100;
    const isAnswered = answers[currentIdx] !== -1;

    return (
      <div style={{ padding: '16px 20px 104px' }}>
        {/* Top bar: Back + Step */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1E293B',
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#2563EB' }}>
            Câu {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </div>
          <div style={{ width: '40px' }} />
        </div>

        {/* Progress Bar 8dp gradient */}
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#E2E8F0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2563EB 0%, #06B6D4 100%)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Category tag */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Nhóm {currentQ.category} — {HOLLAND_NAMES[currentQ.category]}
        </div>

        {/* Question Text 24 đậm */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.35,
            margin: '0 0 24px',
          }}
        >
          {currentQ.question}
        </h3>

        {/* 4 Option cards (>= 72dp) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {OPTIONS.map((opt, optIdx) => {
            const isSelected = answers[currentIdx] === optIdx;

            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                style={{
                  minHeight: '72px',
                  borderRadius: '20px',
                  backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                  border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 14px rgba(37,99,235,0.12)' : '0 2px 6px rgba(0,0,0,0.02)',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: isSelected ? '#DBEAFE' : '#F8FAFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isSelected ? '#2563EB' : '#1E293B',
                      marginBottom: '2px',
                    }}
                  >
                    {opt.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {opt.sub}
                  </div>
                </div>

                {/* Radio Circle */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: isSelected ? '7px solid #2563EB' : '2px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0,
                    transition: 'border 0.2s ease',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Fixed Continue Button */}
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            left: 0,
            right: 0,
            padding: '12px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 40,
          }}
        >
          <div style={{ width: '100%', maxWidth: '520px' }}>
            <Button
              fullWidth
              size="L"
              disabled={!isAnswered}
              onClick={handleNext}
            >
              {currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Xem kết quả phân tích →' : 'Tiếp tục →'}
            </Button>
          </div>
        </div>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '360px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800 }}>
                Bạn muốn dừng làm bài?
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B' }}>
                Tiến trình làm bài hiện tại sẽ không được lưu nếu bạn quay lại.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline"
                  size="M"
                  fullWidth
                  onClick={() => setShowExitConfirm(false)}
                >
                  Làm tiếp
                </Button>
                <Button
                  variant="danger"
                  size="M"
                  fullWidth
                  onClick={() => {
                    setShowExitConfirm(false);
                    setMode('intro');
                  }}
                >
                  Thoát
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 3. RESULT MODE ---
  const resultData = hollandResult || {
    primaryCode: 'E' as HollandCode,
    topCodes: ['E', 'I', 'S'] as HollandCode[],
    scores: { R: 2, I: 4, A: 3, S: 4, E: 6, C: 3 },
    completedAt: 'Hôm nay',
  };

  const primaryName = getHollandName(resultData.primaryCode);
  const primaryDesc = HOLLAND_DESCRIPTIONS[resultData.primaryCode];
  const matchingMajors = HOLLAND_MAJORS[resultData.primaryCode] || [];

  return (
    <div style={{ padding: '20px 20px 104px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>
          Kết quả của bạn
        </h2>
        <button
          onClick={handleRetake}
          style={{
            border: 'none',
            backgroundColor: '#F1F5F9',
            padding: '8px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} /> Làm lại
        </button>
      </div>

      {/* Radar Chart 260dp */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: '20px',
        }}
      >
        <RadarChart scores={resultData.scores} maxScore={6} size={260} />
      </div>

      {/* Group highlight banner */}
      <div
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
          padding: '18px 20px',
          border: '1px solid #93C5FD',
          marginBottom: '16px',
        }}
      >
        <div style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 600, marginBottom: '2px' }}>
          Bạn thuộc nhóm tính cách nổi trội:
        </div>
        <div style={{ fontSize: '20px', fontWeight: 800, color: '#1D4ED8', marginBottom: '8px' }}>
          {primaryName}
        </div>
        <div style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.45 }}>
          {primaryDesc}
        </div>
      </div>

      {/* 3 Top Holland Badges */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '8px' }}>
          Mã định danh Holland top 3 của bạn:
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {resultData.topCodes.map((code, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '10px 8px',
                border: '1px solid #E2E8F0',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB' }}>
                {code}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Top {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Majors */}
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '10px' }}>
          Các ngành học đặc biệt phù hợp:
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {matchingMajors.map((major, idx) => (
            <div
              key={idx}
              style={{
                padding: '8px 14px',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid #DBEAFE',
              }}
            >
              {major}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <Button
          variant="danger"
          size="L"
          fullWidth
          onClick={() => setActiveTab(2)}
        >
          Xem trường phù hợp trên AI Matching →
        </Button>
        <Button
          variant="outline"
          size="L"
          fullWidth
          onClick={() => openCareerPath(resultData.primaryCode)}
        >
          Xem lộ trình phát triển năng lực THPT
        </Button>
      </div>

      <AppFooter text="Kết quả đánh giá dựa trên thang đo tâm lý học John L. Holland." />
    </div>
  );
};
