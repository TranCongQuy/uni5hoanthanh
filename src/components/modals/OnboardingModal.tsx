import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, Compass, Target, Bot } from 'lucide-react';
import { Button } from '../common/UI';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

const SLIDES = [
  {
    title: 'Khám phá tính cách RIASEC',
    desc: 'Thấu hiểu sở thích, tiềm năng và thiên hướng nghề nghiệp qua bài khảo sát 12 câu tiêu chuẩn quốc tế.',
    img: '/images/onboarding_1.png',
    badge: 'BÀI KHẢO SÁT CHUẨN HOA KỲ',
    icon: <Compass size={18} />,
    tags: ['12 câu hỏi ngắn', '5 phút hoàn thành', 'Biểu đồ Radar RIASEC'],
  },
  {
    title: 'Dự đoán trúng tuyển AI Matching',
    desc: 'Thuật toán thông minh đối soát điểm thi THPT và học phí với 30 trường đại học hàng đầu 3 miền.',
    img: '/images/onboarding_2.png',
    badge: 'THUẬT TOÁN ĐỐI SOÁT 30 TRƯỜNG',
    icon: <Target size={18} />,
    tags: ['Điểm chuẩn 2022-2024', 'An toàn - Vừa sức - Thử thách', 'Tối ưu ngân sách'],
  },
  {
    title: 'Trợ lý AI Hướng nghiệp 24/7',
    desc: 'Trò chuyện cùng Trợ lý AI Unipath bất cứ lúc nào để giải đáp mọi thắc mắc về tuyển sinh và chọn ngành.',
    img: '/images/onboarding_3.png',
    badge: 'TRỢ LÝ AI THÔNG MINH 24/7',
    icon: <Bot size={18} />,
    tags: ['Giải đáp tức thì', 'Cá nhân hóa nguyện vọng', 'Miễn phí trải nghiệm'],
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Lock background scroll when onboarding is visible
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

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
        background: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 45%, #F8FAFC 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 20px 28px',
        maxWidth: '520px',
        margin: '0 auto',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* 1. Top Bar */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="/images/logo_unipath.png"
            alt="Unipath Logo"
            style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'contain' }}
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#1E3A8A', letterSpacing: '-0.3px' }}>
            Unipath
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#2563EB',
              backgroundColor: '#EFF6FF',
              padding: '2px 8px',
              borderRadius: '10px',
              border: '1px solid #DBEAFE',
            }}
          >
            {currentSlide + 1} / {SLIDES.length}
          </span>
        </div>

        <button
          onClick={onFinish}
          style={{
            backgroundColor: 'rgba(255,255,255,0.85)',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            border: '1px solid #E2E8F0',
          }}
        >
          Bỏ qua
        </button>
      </div>

      {/* 2. Slide Main Card with Full Bleed Illustration */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '380px',
        }}
      >
        {/* Illustration Container (Gọn gàng vừa khít tỉ lệ ảnh, bỏ 2 vệt đen 2 bên) */}
        <div
          style={{
            maxWidth: '100%',
            height: '240px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
            border: '2px solid rgba(255,255,255,0.95)',
            marginBottom: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <img
            src={slide.img}
            alt={slide.title}
            style={{
              height: '240px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '22px',
              transition: 'opacity 0.4s ease',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/career_header.png';
            }}
          />
        </div>

        {/* Feature Badge placed OUTSIDE image so it never covers the graphic or text */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            fontSize: '11px',
            fontWeight: 800,
            padding: '5px 14px',
            borderRadius: '16px',
            letterSpacing: '0.4px',
            border: '1.5px solid #BFDBFE',
            marginBottom: '10px',
          }}
        >
          {slide.icon}
          <span>{slide.badge}</span>
        </div>

        {/* Title */}
        <h2
          style={{
            margin: '0 0 8px',
            fontSize: '22px',
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1.3,
            letterSpacing: '-0.3px',
          }}
        >
          {slide.title}
        </h2>

        {/* Description */}
        <p
          style={{
            margin: '0 0 16px',
            fontSize: '14px',
            color: '#64748B',
            lineHeight: 1.5,
            padding: '0 8px',
          }}
        >
          {slide.desc}
        </p>

        {/* Feature Tags / Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          {slide.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '12px',
                border: '1px solid #DBEAFE',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Bottom Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '18px',
        }}
      >
        {/* Pagination Dots */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: currentSlide === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: currentSlide === idx ? '#2563EB' : '#CBD5E1',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="L"
          fullWidth
          onClick={handleNext}
          icon={<ChevronRight size={18} />}
        >
          {currentSlide === SLIDES.length - 1 ? 'Khám phá Unipath ngay 🚀' : 'Tiếp tục →'}
        </Button>
      </div>
    </div>
  );
};
