import React, { useState } from 'react';
import { Button } from '../common/UI';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

const SLIDES = [
  {
    title: 'Khám phá tính cách RIASEC',
    desc: 'Thấu hiểu sở thích, tiềm năng và thiên hướng nghề nghiệp qua bài trắc nghiệm 12 câu tiêu chuẩn.',
    img: '/images/onboarding_1.png',
  },
  {
    title: 'Gợi ý thông minh AI Matching',
    desc: 'Thuật toán tự động đối soát điểm thi THPT và ngân sách học phí với 30 trường đại học hàng đầu 3 miền.',
    img: '/images/onboarding_2.png',
  },
  {
    title: 'Đồng hành cùng chuyên gia',
    desc: 'Chiến lược phát triển 3 năm THPT và kết nối tư vấn 1-1 trực tiếp cùng ban tuyển sinh các trường.',
    img: '/images/onboarding_3.png',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px 32px',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Top Bar with Skip button */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onFinish}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#64748B',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 12px',
          }}
        >
          Bỏ qua
        </button>
      </div>

      {/* Slide Illustration */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
        <div
          style={{
            width: '240px',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <img
            src={slide.img}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Title & Desc */}
        <h2 style={{ margin: '0 0 10px', fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
          {slide.title}
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748B', maxWidth: '320px', lineHeight: 1.5 }}>
          {slide.desc}
        </p>
      </div>

      {/* Bottom Controls: Dots + Button */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: currentSlide === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === idx ? '#2563EB' : '#CBD5E1',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Next / Start Button */}
        <Button
          variant="primary"
          size="L"
          fullWidth
          onClick={handleNext}
        >
          {currentSlide === SLIDES.length - 1 ? 'Bắt đầu ngay →' : 'Tiếp tục →'}
        </Button>
      </div>
    </div>
  );
};
