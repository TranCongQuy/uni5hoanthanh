import React, { useState, useEffect } from 'react';
import {
  Bell,
  Bot,
  Search,
  Sparkles,
  Compass,
  Radio,
  ChevronRight,
  Heart,
  Scale,
  MapPin,
  GraduationCap,
  Briefcase,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES, getUniversitiesByRegion } from '../../data/MockData';
import { Button, UniversityAvatar, ImageSafe, AppFooter, EmptyState } from '../common/UI';

export const HomeTab: React.FC = () => {
  const {
    user,
    profile,
    favoriteIds,
    toggleFavorite,
    compareIds,
    toggleCompare,
    setActiveTab,
    openUniDetail,
    openCompareModal,
    openChatBot,
    openCareerPath,
    openNotifications,
    searchKeyword,
    setSearchKeyword,
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<string>('Tất cả');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng,';
    if (hour < 18) return 'Chào buổi chiều,';
    return 'Chào buổi tối,';
  };

  // Hero slides auto rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Filter universities
  const baseList = getUniversitiesByRegion(selectedRegion);
  const filteredUniversities = baseList.filter((u) => {
    if (!searchKeyword.trim()) return true;
    const query = searchKeyword.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(query) ||
      u.code.toLowerCase().includes(query) ||
      u.loc.toLowerCase().includes(query) ||
      u.majors.some((m) => m.toLowerCase().includes(query))
    );
  });

  // Featured 8 universities across North, Central, and South regions
  const featuredUnis = [
    UNIVERSITIES.find((u) => u.id === 1)!, // BKA - Bách Khoa HN
    UNIVERSITIES.find((u) => u.id === 2)!, // FTU - Ngoại Thương
    UNIVERSITIES.find((u) => u.id === 3)!, // NEU - Kinh Tế Quốc Dân
    UNIVERSITIES.find((u) => u.id === 11)!, // PXU - Phú Xuân
    UNIVERSITIES.find((u) => u.id === 13)!, // DUT - Bách Khoa ĐN
    UNIVERSITIES.find((u) => u.id === 21)!, // HCMUT - Bách Khoa HCM
    UNIVERSITIES.find((u) => u.id === 23)!, // UEH - Kinh Tế HCM
    UNIVERSITIES.find((u) => u.id === 24)!, // UIT - CNTT HCM
  ].filter(Boolean);

  const featuredScrollRef = React.useRef<HTMLDivElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const carouselDirectionRef = React.useRef<'forward' | 'backward'>('forward');

  // Auto transition: Left-to-Right, and at the end bounce Right-to-Left
  useEffect(() => {
    if (isCarouselHovered) return;

    const interval = setInterval(() => {
      setFeaturedIndex((prev) => {
        const totalItems = 9; // 8 universities + 1 "Xem tất cả" card
        if (carouselDirectionRef.current === 'forward') {
          if (prev < totalItems - 1) {
            return prev + 1;
          } else {
            carouselDirectionRef.current = 'backward';
            return prev - 1;
          }
        } else {
          if (prev > 0) {
            return prev - 1;
          } else {
            carouselDirectionRef.current = 'forward';
            return prev + 1;
          }
        }
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  // Smooth scroll container to match featuredIndex
  useEffect(() => {
    if (featuredScrollRef.current) {
      const cardWidth = 284; // 270px width + 14px gap
      featuredScrollRef.current.scrollTo({
        left: featuredIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [featuredIndex]);

  const scrollToAllUniversities = () => {
    setSelectedRegion('Tất cả');
    const el = document.getElementById('all-universities-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container" style={{ paddingBottom: '96px' }}>
      {/* 1. Header 64dp */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #2563EB',
              boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={profile.avatarPath || '/images/avatar_user.png'}
              alt="Avatar"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
              {getGreeting()}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.2,
                maxWidth: '160px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name || 'Học sinh Unipath'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Notifications button */}
          <button
            onClick={openNotifications}
            aria-label="Thông báo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: '#1E293B',
            }}
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '9px',
                right: '10px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                border: '1.5px solid #FFFFFF',
              }}
            />
          </button>

          {/* Chatbot button */}
          <button
            onClick={openChatBot}
            aria-label="Trợ lý AI"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: '#2563EB',
              border: 'none',
              boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
            }}
          >
            <Bot size={22} />
          </button>
        </div>
      </header>

      {/* 2. Hero Slider 200dp */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div
          style={{
            position: 'relative',
            height: '200px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(37,99,235,0.18)',
          }}
        >
          {/* Slide 1: AI Test */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 55%, #06B6D4 100%)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              opacity: currentSlide === 0 ? 1 : 0,
              pointerEvents: currentSlide === 0 ? 'auto' : 'none',
              transition: 'opacity 0.6s ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0, zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                AI HƯỚNG NGHIỆP 2026
              </div>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.3,
                  margin: '0 0 14px',
                }}
              >
                Khám phá ngành học phù hợp với bạn
              </h2>
              <Button
                variant="onGradient"
                size="M"
                onClick={() => setActiveTab(1)}
              >
                Làm bài test →
              </Button>
            </div>

            {/* KHUNG ẢNH FULL VỪA KHÍT 100% */}
            <div
              style={{
                width: '130px',
                height: '115px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.3)',
                flexShrink: 0,
                position: 'relative',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <img
                src="/images/home_hero_art.png"
                alt="AI hướng nghiệp"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/career_header.png';
                }}
              />
            </div>
          </div>

          {/* Slide 2: Virtual EduFair */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 60%, #06B6D4 100%)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              opacity: currentSlide === 1 ? 1 : 0,
              pointerEvents: currentSlide === 1 ? 'auto' : 'none',
              transition: 'opacity 0.6s ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0, zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    animation: 'pulse 1s infinite',
                  }}
                />
                LIVE NOW
              </div>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.3,
                  margin: '0 0 14px',
                }}
              >
                Virtual EduFair 2026: Giao lưu 30 trường
              </h2>
              <Button
                variant="onGradient"
                size="M"
                onClick={() => setActiveTab(3)}
              >
                Tham gia ngay →
              </Button>
            </div>

            {/* KHUNG ẢNH DEMO VỪA KHÍT - BẠN CHỈ CẦN THAY ĐƯỜNG DẪN ẢNH VÀO SRC DƯỚI ĐÂY */}
            <div
              style={{
                width: '130px',
                height: '115px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.3)',
                flexShrink: 0,
                position: 'relative',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <img
                src="/images/advisor_live.png"
                alt="Virtual EduFair Live"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/banner_edufair.png';
                }}
              />
            </div>
          </div>

          {/* Slide 3: Unipath Premium */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              opacity: currentSlide === 2 ? 1 : 0,
              pointerEvents: currentSlide === 2 ? 'auto' : 'none',
              transition: 'opacity 0.6s ease',
            }}
          >
            <div style={{ flex: 1, minWidth: 0, zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '8px',
                }}
              >
                ƯU ĐÃI -50% HÔM NAY
              </div>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.3,
                  margin: '0 0 14px',
                }}
              >
                Unipath Premium: Lộ trình & Trợ lý AI VIP
              </h2>
              <Button
                variant="onGradient"
                size="M"
                onClick={() => setActiveTab(4)}
              >
                Xem chi tiết →
              </Button>
            </div>

            {/* KHUNG ẢNH FULL VỪA KHÍT 100% */}
            <div
              style={{
                width: '130px',
                height: '115px',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.3)',
                flexShrink: 0,
                position: 'relative',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            >
              <img
                src="/images/slide_premium.png"
                alt="Premium"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/banner_edufair.png';
                }}
              />
            </div>
          </div>

          {/* Slide Indicator Dots */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}
          >
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: currentSlide === idx ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Search Box Pill 52dp */}
      <div style={{ padding: '8px 20px 16px' }}>
        <div
          style={{
            height: '52px',
            borderRadius: '26px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: '12px',
          }}
        >
          <Search size={20} color="#64748B" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm trường, ngành học, khu vực..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: '15px',
              color: '#0F172A',
              backgroundColor: 'transparent',
            }}
          />
          {searchKeyword && (
            <button
              onClick={() => setSearchKeyword('')}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* 4. Three shortcut cards + THPT Roadmap banner */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {/* Shortcut 1: Holland */}
          <div
            onClick={() => setActiveTab(1)}
            style={{
              height: '104px',
              borderRadius: '20px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(37,99,235,0.06)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                marginBottom: '6px',
                boxShadow: '0 2px 6px rgba(37,99,235,0.12)',
              }}
            >
              <Compass size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
              Trắc nghiệm RIASEC
            </span>
          </div>

          {/* Shortcut 2: AI Matching */}
          <div
            onClick={() => setActiveTab(2)}
            style={{
              height: '104px',
              borderRadius: '20px',
              backgroundColor: '#F0FDF4',
              border: '1px solid #DCFCE7',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(16,185,129,0.06)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                marginBottom: '6px',
                boxShadow: '0 2px 6px rgba(16,185,129,0.12)',
              }}
            >
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
              AI Matching 2026
            </span>
          </div>

          {/* Shortcut 3: Unipath LIVE */}
          <div
            onClick={() => setActiveTab(3)}
            style={{
              height: '104px',
              borderRadius: '20px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              cursor: 'pointer',
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 2px 6px rgba(239,68,68,0.06)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                marginBottom: '6px',
                boxShadow: '0 2px 6px rgba(239,68,68,0.12)',
              }}
            >
              <Radio size={22} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
              Unipath LIVE
            </span>
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '8px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '9px',
                fontWeight: 800,
                padding: '2px 5px',
                borderRadius: '6px',
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* THPT Roadmap banner 64dp */}
        <div
          onClick={() => openCareerPath()}
          style={{
            marginTop: '12px',
            height: '60px',
            borderRadius: '18px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: '#F3E8FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                Lộ trình Phát triển THPT
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Kế hoạch học tập Lớp 10, 11, 12 chuẩn theo nhóm ngành
              </div>
            </div>
          </div>
          <ChevronRight size={20} color="#94A3B8" />
        </div>
      </div>

      {/* 5. Featured Carousel "Trường gợi ý cho bạn" */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px 12px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Trường gợi ý cho bạn
            </h3>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              Top trường có chỉ số việc làm & đào tạo xuất sắc
            </span>
          </div>
        </div>

        {/* Horizontal Snap Scroll with Auto-bounce & Direction reversal */}
        <div
          ref={featuredScrollRef}
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          onTouchStart={() => setIsCarouselHovered(true)}
          onTouchEnd={() => setIsCarouselHovered(false)}
          style={{
            display: 'flex',
            gap: '14px',
            overflowX: 'auto',
            padding: '0 20px 8px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {featuredUnis.map((uni, idx) => {
            const isFav = favoriteIds.includes(uni.id);
            const isComp = compareIds.includes(uni.id);
            const isCurrent = featuredIndex === idx;

            return (
              <div
                key={uni.id}
                onClick={() => openUniDetail(uni.id)}
                style={{
                  minWidth: '270px',
                  width: '270px',
                  height: '240px',
                  borderRadius: '24px',
                  backgroundColor: '#FFFFFF',
                  border: isCurrent ? '2px solid #2563EB' : '1px solid #E2E8F0',
                  boxShadow: isCurrent ? '0 8px 24px rgba(37,99,235,0.18)' : '0 4px 16px rgba(37,99,235,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  transform: isCurrent ? 'translateY(-2px)' : 'none',
                }}
              >
                {/* Upper Campus Image */}
                <div style={{ position: 'relative', height: '120px', width: '100%', backgroundColor: '#E2E8F0' }}>
                  <ImageSafe
                    src={`/images/campus_${uni.code.toLowerCase()}.jpg`}
                    fallbackSrc="/images/campus_default.png"
                    altText={uni.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* % Match badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(4px)',
                      color: '#10B981',
                      fontWeight: 800,
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    92% phù hợp
                  </div>
                </div>

                {/* Lower Content */}
                <div style={{ padding: '12px 14px 10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <UniversityAvatar code={uni.code} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {uni.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {uni.code} • Miền {uni.region}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '4px',
                    }}
                  >
                    {uni.majors.slice(0, 2).join(' • ')}
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '6px',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                      {uni.tuitionMin} - {uni.tuitionMax} tr/năm
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(uni.id);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isFav ? '#FEE2E2' : '#F1F5F9',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isFav ? '#EF4444' : '#64748B',
                          cursor: 'pointer',
                        }}
                      >
                        <Heart size={16} fill={isFav ? '#EF4444' : 'none'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(uni.id);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isComp ? '#EFF6FF' : '#F1F5F9',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isComp ? '#2563EB' : '#64748B',
                          cursor: 'pointer',
                        }}
                      >
                        <Scale size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Special Card at the End: "Xem tất cả các trường" */}
          <div
            onClick={scrollToAllUniversities}
            style={{
              minWidth: '270px',
              width: '270px',
              height: '240px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #06B6D4 100%)',
              boxShadow: featuredIndex === 8 ? '0 8px 24px rgba(37,99,235,0.3)' : '0 4px 16px rgba(37,99,235,0.12)',
              border: featuredIndex === 8 ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px 20px',
              cursor: 'pointer',
              scrollSnapAlign: 'start',
              flexShrink: 0,
              textAlign: 'center',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                border: '1.5px solid rgba(255,255,255,0.4)',
              }}
            >
              <GraduationCap size={30} color="#FFFFFF" />
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800 }}>
              Xem tất cả 30 trường
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: '12px', opacity: 0.9, lineHeight: 1.4 }}>
              Khám phá toàn bộ dữ liệu điểm chuẩn & học phí 3 miền Bắc - Trung - Nam
            </p>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                color: '#2563EB',
                padding: '8px 18px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              Khám phá ngay <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Numbered Dots Indicator for Carousel Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '12px',
            padding: '0 20px',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
            const isActive = featuredIndex === idx;
            const isLast = idx === 8;
            return (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                style={{
                  minWidth: isActive ? (isLast ? '46px' : '26px') : '18px',
                  height: '20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: isActive ? '#2563EB' : '#E2E8F0',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  padding: '0 4px',
                }}
                title={isLast ? 'Xem tất cả' : `Trường ${idx + 1}`}
              >
                {isActive ? (isLast ? 'Tất cả' : idx + 1) : (isLast ? '★' : idx + 1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Section "Danh sách trường" + Region Filter */}
      <div id="all-universities-section" style={{ padding: '0 20px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Danh sách 30 trường đại học
          </h3>

          {/* Region Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((region) => {
              const active = selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    height: '38px',
                    padding: '0 18px',
                    borderRadius: '19px',
                    backgroundColor: active ? '#2563EB' : '#FFFFFF',
                    color: active ? '#FFFFFF' : '#475569',
                    border: active ? 'none' : '1px solid #CBD5E1',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: active ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {region === 'Tất cả' ? 'Toàn quốc (30)' : `Miền ${region} (10)`}
                </button>
              );
            })}
          </div>
        </div>

        {/* University List Cards */}
        {filteredUniversities.length === 0 ? (
          <EmptyState
            title="Không tìm thấy trường phù hợp"
            description={`Không có kết quả nào cho "${searchKeyword}". Thử tìm kiếm theo tên trường, mã hoặc ngành học.`}
            actionText="Xem tất cả trường"
            onAction={() => {
              setSearchKeyword('');
              setSelectedRegion('Tất cả');
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUniversities.map((uni) => {
              const isFav = favoriteIds.includes(uni.id);
              const isComp = compareIds.includes(uni.id);

              return (
                <div
                  key={uni.id}
                  onClick={() => openUniDetail(uni.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '16px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  {/* Top row: Avatar + Name + Wishlist */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <UniversityAvatar code={uni.code} size={52} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#0F172A',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                        }}
                      >
                        {uni.name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          color: '#64748B',
                        }}
                      >
                        <MapPin size={13} color="#94A3B8" />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {uni.loc}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(uni.id);
                      }}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isFav ? '#FEE2E2' : '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isFav ? '#EF4444' : '#64748B',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Heart size={18} fill={isFav ? '#EF4444' : 'none'} />
                    </button>
                  </div>

                  {/* Middle row: Stats pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <span style={{ color: '#64748B' }}>Học phí:</span>
                      <strong style={{ color: '#2563EB' }}>{uni.tuitionMin}-{uni.tuitionMax} tr/năm</strong>
                    </div>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <span style={{ color: '#64748B' }}>Chuẩn 2024:</span>
                      <strong>{uni.score2024} đ</strong>
                    </div>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <Briefcase size={12} color="#10B981" />
                      <strong style={{ color: '#10B981' }}>{uni.employmentRate}% việc làm</strong>
                    </div>
                  </div>

                  {/* Bottom row: Compare action */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {uni.majors.length} chuyên ngành đào tạo
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(uni.id);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '14px',
                        backgroundColor: isComp ? '#EFF6FF' : '#FFFFFF',
                        border: isComp ? '1px solid #2563EB' : '1px solid #CBD5E1',
                        color: isComp ? '#2563EB' : '#475569',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      <Scale size={14} />
                      {isComp ? 'Đã thêm so sánh' : '+ Thêm so sánh'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <AppFooter text={`Đã hiển thị ${filteredUniversities.length}/30 trường đại học`} />
      </div>

      {/* 7. Floating Action Button: So sánh (n) */}
      {compareIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '76px',
            right: '20px',
            zIndex: 45,
          }}
        >
          <button
            onClick={openCompareModal}
            style={{
              height: '48px',
              padding: '0 20px',
              borderRadius: '24px',
              backgroundColor: '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              boxShadow: '0 6px 20px rgba(37,99,235,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              animation: 'bounceIn 0.3s ease',
            }}
          >
            <Scale size={18} />
            <span>So sánh ({compareIds.length})</span>
          </button>
        </div>
      )}
    </div>
  );
};
