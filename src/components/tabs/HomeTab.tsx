import React, { useState } from 'react';
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
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { University } from '../../types';
import { calculateSingleMatch } from '../../services/MatchingService';
import { getCutoffRangeText } from '../../data/MockData';
import { formatTuitionRange } from '../../utils/validation';
import { UniversityAvatar, ImageSafe, AppFooter, EmptyState } from '../common/UI';
import { AccountRoleMenu } from '../common/AccountRoleMenu';

// % phù hợp hiển thị trên thẻ trường: dùng CHUNG công thức thống nhất với AI Matching và Chi tiết trường.
const badgePercent = (uni: University, score: number, hollandCode?: string): number => {
  return calculateSingleMatch(uni, score, hollandCode).matchingPercent;
};

export const HomeTab: React.FC = () => {
  const {
    isLoggedIn,
    isGuest,
    user,
    profile,
    favoriteIds,
    toggleFavorite,
    compareIds,
    toggleCompare,
    clearCompare,
    setActiveTab,
    openUniDetail,
    openCompareModal,
    openChatBot,
    openCareerPath,
    openNotifications,
    unreadNotificationCount,
    searchKeyword,
    setSearchKeyword,
    universitiesList,
    hollandResult,
    aiMatchState,
    myBookings,
    myApplications,
    openBookConsultation,
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<string>('Tất cả');
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isSearchDropdownDismissed, setIsSearchDropdownDismissed] = useState<boolean>(false);
  const [activatingShortcutId, setActivatingShortcutId] = useState<number | null>(null);

  const handleShortcutClick = (id: number, callback: () => void) => {
    if (activatingShortcutId !== null) return;
    setActivatingShortcutId(id);
    setTimeout(() => {
      callback();
      setActivatingShortcutId(null);
    }, 800);
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng,';
    if (hour < 18) return 'Chào buổi chiều,';
    return 'Chào buổi tối,';
  };

  // Hero slide initial state: user-controlled, no intrusive auto-rotation (Taste Skill Rule 5)
  // Maintains visual stability and prevents jarring layout shifts.

  // Filter universities
  const baseList =
    selectedRegion === 'Tất cả' ? universitiesList : universitiesList.filter((u) => u.region === selectedRegion);
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

  // Autocomplete search matches across all 30 universities
  const searchMatches = searchKeyword.trim().length > 0 ? universitiesList.filter((u) => {
    const query = searchKeyword.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(query) ||
      u.code.toLowerCase().includes(query) ||
      u.loc.toLowerCase().includes(query) ||
      u.majors.some((m) => m.toLowerCase().includes(query))
    );
  }) : [];

  // Featured 8 universities across North, Central, and South regions
  const featuredUnis = [
    universitiesList.find((u) => u.id === 1)!, // BKA - Bách Khoa HN
    universitiesList.find((u) => u.id === 2)!, // FTU - Ngoại Thương
    universitiesList.find((u) => u.id === 3)!, // NEU - Kinh Tế Quốc Dân
    universitiesList.find((u) => u.id === 11)!, // PXU - Phú Xuân
    universitiesList.find((u) => u.id === 12)!, // DUT - Bách Khoa ĐN
    universitiesList.find((u) => u.id === 21)!, // HCMUT - Bách Khoa HCM
    universitiesList.find((u) => u.id === 23)!, // UEH - Kinh Tế HCM
    universitiesList.find((u) => u.id === 24)!, // UIT - CNTT HCM
  ].filter(Boolean);

  const featuredScrollRef = React.useRef<HTMLDivElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const scrollToFeatured = (idx: number) => {
    setFeaturedIndex(idx);
    if (featuredScrollRef.current) {
      const cardWidth = 284; // 270px width + 14px gap
      featuredScrollRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const scrollToAllUniversities = () => {
    setSelectedRegion('Tất cả');
    setVisibleCount(10);
    const el = document.getElementById('all-universities-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const journeySteps = [
    {
      num: '1',
      title: 'Test Holland',
      sub: hollandResult ? `Mã ${hollandResult.primaryCode}` : '12 câu hỏi',
      done: Boolean(hollandResult),
      onClick: () => setActiveTab(1),
    },
    {
      num: '2',
      title: 'AI Phân tích',
      sub: aiMatchState.hasEvaluated ? `${aiMatchState.score} điểm` : 'Dự báo 30 ĐH',
      done: Boolean(aiMatchState.hasEvaluated),
      onClick: () => setActiveTab(2),
    },
    {
      num: '3',
      title: 'Tư vấn 1-1',
      sub: myBookings.length > 0 ? `${myBookings.length} lịch hẹn` : 'Đặt lịch hẹn',
      done: myBookings.length > 0 || compareIds.length >= 2,
      onClick: () => openBookConsultation(),
    },
    {
      num: '4',
      title: 'Nộp hồ sơ',
      sub: myApplications.length > 0 ? `${myApplications.length} hồ sơ` : 'Xét tuyển sớm',
      done: myApplications.length > 0,
      onClick: () => (myApplications.length > 0 ? setActiveTab(4) : scrollToAllUniversities()),
    },
  ];
  const completedStepsCount = journeySteps.filter((s) => s.done).length;
  const nextStepIdx = journeySteps.findIndex((s) => !s.done);

  return (
    <div className="home-container" style={{ paddingBottom: '96px' }}>
      {/* 1. Header 64dp with 1-Click Account & Role Menu */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          height: '64px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #F1F5F9',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '40px',
              height: '40px',
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
              {getGreeting()}
            </div>
            <div
              style={{
                fontSize: '14.5px',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isLoggedIn && !isGuest ? (user.name || 'Học sinh UniPath') : 'Khách trải nghiệm'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {/* Notifications button */}
          <button
            onClick={openNotifications}
            aria-label="Thông báo"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: '#1E293B',
              flexShrink: 0,
            }}
          >
            <Bell size={18} />
            {unreadNotificationCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  minWidth: '16px',
                  height: '16px',
                  padding: '0 3px',
                  borderRadius: '999px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                }}
              >
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Chatbot button */}
          <button
            onClick={openChatBot}
            aria-label="Trợ lý AI"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '11px',
              backgroundColor: '#2563EB',
              border: 'none',
              boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <Bot size={19} />
          </button>

          {/* Account & 1-Click Role Switcher */}
          <AccountRoleMenu variant="light" compact />
        </div>
      </header>

      {/* 2. Single-Message SaaS Hero */}
      <div style={{ padding: '14px 20px 8px' }}>
        <div
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)',
            padding: '24px 20px',
            color: '#FFFFFF',
            boxShadow: 'var(--up-shadow-lg, 0 10px 25px -5px rgba(30,27,75,0.25))',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Subtle Geometric SVG Pattern */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0.14,
              pointerEvents: 'none',
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="hero-pattern-mobile" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M0 28 L28 0 M0 0 L28 28" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                <circle cx="14" cy="14" r="1.2" fill="#FFFFFF" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern-mobile)" />
          </svg>

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(8px)',
                color: '#E0E7FF',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                marginBottom: '10px',
              }}
            >
              <span>✨ HỆ SINH THÁI TUYỂN SINH THÔNG MINH 2026</span>
            </div>

            <h1
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.3,
                margin: '0 0 8px',
                letterSpacing: '-0.3px',
                fontFamily: 'var(--up-font-family)',
              }}
            >
              Khám phá Ngành học &amp; Dự báo Trúng tuyển cùng AI
            </h1>

            <p
              style={{
                margin: '0 0 16px',
                fontSize: '12.5px',
                color: '#C7D2FE',
                lineHeight: 1.45,
                fontWeight: 400,
              }}
            >
              Khảo sát tính cách Holland RIASEC đối soát điểm chuẩn và học phí 30 trường đại học hàng đầu Việt Nam.
            </p>

            <button
              onClick={() => setActiveTab(1)}
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                color: 'var(--up-student-primary, #4F46E5)',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform var(--up-transition-fast, 150ms ease), box-shadow var(--up-transition-fast, 150ms ease)',
                fontFamily: 'var(--up-font-family)',
              }}
            >
              <span>Bắt đầu khảo sát RIASEC</span>
              <span>→</span>
            </button>

            {/* Social Proof Metric Numbers */}
            <div
              className="tabular-nums"
              style={{
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '11px',
                color: '#E0E7FF',
              }}
            >
              <span style={{ fontWeight: 700 }}>30 Trường đại học</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span style={{ fontWeight: 700 }}>3 Miền Bắc - Trung - Nam</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span style={{ fontWeight: 700, color: '#A7F3D0' }}>92% Có việc làm</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2B. 4-Step Student Journey Stepper ("Nhìn 3 Giây Hiểu Ngay") */}
      <div style={{ padding: '6px 20px 8px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            padding: '13px 14px',
            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
              🎯 Hành trình Chọn Trường 4 Bước
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                backgroundColor: completedStepsCount === 4 ? '#ECFDF5' : '#EFF6FF',
                color: completedStepsCount === 4 ? '#047857' : '#2563EB',
              }}
            >
              {completedStepsCount}/4 hoàn tất
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {journeySteps.map((step, idx) => {
              const isNext = idx === nextStepIdx;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={step.onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '13px',
                    border: step.done
                      ? '1px solid #A7F3D0'
                      : isNext
                      ? '1.5px solid #2563EB'
                      : '1px solid #E2E8F0',
                    backgroundColor: step.done ? '#F0FDF4' : isNext ? '#EFF6FF' : '#F8FAFC',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minWidth: 0,
                  }}
                >
                  {step.done ? (
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                  ) : (
                    <span
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isNext ? '#2563EB' : '#CBD5E1',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {step.num}
                    </span>
                  )}
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.title}
                    </span>
                    <span style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: step.done ? '#047857' : isNext ? '#1D4ED8' : '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.sub}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Search Box Pill 52dp with Real-time Autocomplete Dropdown */}
      <div style={{ padding: '8px 20px 16px', position: 'relative', zIndex: 45 }}>
        <div
          style={{
            height: '52px',
            borderRadius: '26px',
            backgroundColor: '#FFFFFF',
            border: isSearchFocused ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
            boxShadow: isSearchFocused ? '0 4px 16px rgba(37,99,235,0.15)' : '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px',
            gap: '12px',
            transition: 'all 0.2s ease',
          }}
        >
          <Search size={20} color={isSearchFocused ? '#2563EB' : '#64748B'} />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setIsSearchDropdownDismissed(false);
            }}
            onFocus={() => {
              setIsSearchFocused(true);
              setIsSearchDropdownDismissed(false);
            }}
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
              onClick={() => {
                setSearchKeyword('');
                setIsSearchFocused(false);
              }}
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

        {/* Real-time Autocomplete Dropdown (Tối đa 3 trường + Nút xem tất cả) */}
        {searchKeyword.trim().length > 0 && isSearchFocused && !isSearchDropdownDismissed && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% - 6px)',
              left: '20px',
              right: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 14px 36px rgba(0,0,0,0.16)',
              border: '1.5px solid #DBEAFE',
              overflow: 'hidden',
              zIndex: 90,
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Gợi ý tìm kiếm ({searchMatches.length} trường phù hợp)
              </span>
              <button
                onClick={() => setIsSearchDropdownDismissed(true)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {searchMatches.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                Không tìm thấy trường nào phù hợp với từ khóa "<strong>{searchKeyword}</strong>"
              </div>
            ) : (
              <div>
                {searchMatches.slice(0, 3).map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => {
                      setIsSearchDropdownDismissed(true);
                      openUniDetail(uni.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderBottom: '1px solid #F8FAFC',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F7FF')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <UniversityAvatar code={uni.code} size={38} />
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#2563EB',
                            backgroundColor: '#EFF6FF',
                            padding: '1px 6px',
                            borderRadius: '6px',
                          }}
                        >
                          {uni.code} • {uni.region}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>
                          Chuẩn: <strong style={{ color: '#0F172A' }}>{uni.score2024} đ</strong>
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#94A3B8" />
                  </div>
                ))}

                {searchMatches.length > 3 && (
                  <button
                    onClick={() => {
                      setIsSearchDropdownDismissed(true);
                      scrollToAllUniversities();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#EFF6FF',
                      border: 'none',
                      borderTop: '1px solid #DBEAFE',
                      color: '#1D4ED8',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Xem tất cả {searchMatches.length} trường phù hợp</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Four Vibrant Interactive Quick Action Cards (RIASEC, AI Match, LIVE, Lộ trình THPT) */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* Card 1: RIASEC */}
          <div
            onClick={() => handleShortcutClick(1, () => setActiveTab(1))}
            style={{
              borderRadius: '20px',
              background: activatingShortcutId === 1
                ? 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)'
                : 'linear-gradient(135deg, #EEF2FF 0%, #DBEAFE 100%)',
              border: activatingShortcutId === 1 ? '2px solid #1D4ED8' : '1.5px solid #C7D2FE',
              padding: '14px',
              cursor: 'pointer',
              boxShadow: activatingShortcutId === 1
                ? '0 10px 25px rgba(37,99,235,0.45), inset 0 0 10px rgba(255,255,255,0.2)'
                : '0 4px 12px rgba(37,99,235,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '108px',
              transform: activatingShortcutId === 1 ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: activatingShortcutId === 1 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activatingShortcutId === 1 ? '#FFFFFF' : '#2563EB',
                  boxShadow: activatingShortcutId === 1 ? 'none' : '0 2px 6px rgba(37,99,235,0.15)',
                  transform: activatingShortcutId === 1 ? 'rotate(15deg) scale(1.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Compass size={22} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: activatingShortcutId === 1 ? '#FFFFFF' : '#1D4ED8',
                  backgroundColor: activatingShortcutId === 1 ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  letterSpacing: '0.4px',
                }}
              >
                {activatingShortcutId === 1 ? '⚡ ĐANG MỞ...' : 'HOT'}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activatingShortcutId === 1 ? '#FFFFFF' : '#0F172A',
                  marginTop: '8px',
                  transition: 'color 0.2s',
                }}
              >
                Trắc nghiệm RIASEC
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: activatingShortcutId === 1 ? '#DBEAFE' : '#64748B',
                  marginTop: '2px',
                  transition: 'color 0.2s',
                }}
              >
                Holland 6 nhóm tính cách
              </div>
            </div>
          </div>

          {/* Card 2: AI Matching */}
          <div
            onClick={() => handleShortcutClick(2, () => setActiveTab(2))}
            style={{
              borderRadius: '20px',
              background: activatingShortcutId === 2
                ? 'linear-gradient(135deg, #065F46 0%, #059669 100%)'
                : 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              border: activatingShortcutId === 2 ? '2px solid #047857' : '1.5px solid #A7F3D0',
              padding: '14px',
              cursor: 'pointer',
              boxShadow: activatingShortcutId === 2
                ? '0 10px 25px rgba(5,150,105,0.45), inset 0 0 10px rgba(255,255,255,0.2)'
                : '0 4px 12px rgba(16,185,129,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '108px',
              transform: activatingShortcutId === 2 ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: activatingShortcutId === 2 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activatingShortcutId === 2 ? '#FFFFFF' : '#10B981',
                  boxShadow: activatingShortcutId === 2 ? 'none' : '0 2px 6px rgba(16,185,129,0.15)',
                  transform: activatingShortcutId === 2 ? 'rotate(15deg) scale(1.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={22} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: activatingShortcutId === 2 ? '#FFFFFF' : '#047857',
                  backgroundColor: activatingShortcutId === 2 ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  letterSpacing: '0.4px',
                }}
              >
                {activatingShortcutId === 2 ? '⚡ ĐANG MỞ...' : 'AI 2026'}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activatingShortcutId === 2 ? '#FFFFFF' : '#0F172A',
                  marginTop: '8px',
                  transition: 'color 0.2s',
                }}
              >
                AI Matching 2026
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: activatingShortcutId === 2 ? '#D1FAE5' : '#64748B',
                  marginTop: '2px',
                  transition: 'color 0.2s',
                }}
              >
                Dự đoán trúng tuyển 30 trường
              </div>
            </div>
          </div>

          {/* Card 3: Unipath LIVE */}
          <div
            onClick={() => handleShortcutClick(3, () => setActiveTab(3))}
            style={{
              borderRadius: '20px',
              background: activatingShortcutId === 3
                ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
              border: activatingShortcutId === 3 ? '2px solid #B91C1C' : '1.5px solid #FECDD3',
              padding: '14px',
              cursor: 'pointer',
              boxShadow: activatingShortcutId === 3
                ? '0 10px 25px rgba(220,38,38,0.45), inset 0 0 10px rgba(255,255,255,0.2)'
                : '0 4px 12px rgba(239,68,68,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '108px',
              transform: activatingShortcutId === 3 ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: activatingShortcutId === 3 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activatingShortcutId === 3 ? '#FFFFFF' : '#EF4444',
                  boxShadow: activatingShortcutId === 3 ? 'none' : '0 2px 6px rgba(239,68,68,0.15)',
                  transform: activatingShortcutId === 3 ? 'rotate(15deg) scale(1.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Radio size={22} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: activatingShortcutId === 3 ? '#FFFFFF' : '#B91C1C',
                  backgroundColor: activatingShortcutId === 3 ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  letterSpacing: '0.4px',
                }}
              >
                {activatingShortcutId === 3 ? (
                  '⚡ ĐANG MỞ...'
                ) : (
                  <>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                      }}
                    />
                    LIVE
                  </>
                )}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activatingShortcutId === 3 ? '#FFFFFF' : '#0F172A',
                  marginTop: '8px',
                  transition: 'color 0.2s',
                }}
              >
                Unipath LIVE
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: activatingShortcutId === 3 ? '#FEE2E2' : '#64748B',
                  marginTop: '2px',
                  transition: 'color 0.2s',
                }}
              >
                Virtual EduFair 30 trường
              </div>
            </div>
          </div>

          {/* Card 4: Lộ trình THPT */}
          <div
            onClick={() => handleShortcutClick(4, () => openCareerPath(hollandResult?.primaryCode))}
            style={{
              borderRadius: '20px',
              background: activatingShortcutId === 4
                ? 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)'
                : 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
              border: activatingShortcutId === 4 ? '2px solid #6D28D9' : '1.5px solid #E9D5FF',
              padding: '14px',
              cursor: 'pointer',
              boxShadow: activatingShortcutId === 4
                ? '0 10px 25px rgba(124,58,237,0.45), inset 0 0 10px rgba(255,255,255,0.2)'
                : '0 4px 12px rgba(168,85,247,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '108px',
              transform: activatingShortcutId === 4 ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: activatingShortcutId === 4 ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: activatingShortcutId === 4 ? '#FFFFFF' : '#8B5CF6',
                  boxShadow: activatingShortcutId === 4 ? 'none' : '0 2px 6px rgba(139,92,246,0.15)',
                  transform: activatingShortcutId === 4 ? 'rotate(15deg) scale(1.1)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <GraduationCap size={22} />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: activatingShortcutId === 4 ? '#FFFFFF' : '#6D28D9',
                  backgroundColor: activatingShortcutId === 4 ? 'rgba(255,255,255,0.25)' : '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '8px',
                  letterSpacing: '0.4px',
                }}
              >
                {activatingShortcutId === 4 ? '⚡ ĐANG MỞ...' : 'VIP'}
              </span>
            </div>
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: activatingShortcutId === 4 ? '#FFFFFF' : '#0F172A',
                  marginTop: '8px',
                  transition: 'color 0.2s',
                }}
              >
                Lộ trình Phát triển THPT
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: activatingShortcutId === 4 ? '#F3E8FF' : '#64748B',
                  marginTop: '2px',
                  transition: 'color 0.2s',
                }}
              >
                Kế hoạch 3 năm lớp 10-12
              </div>
            </div>
          </div>
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

        {/* Horizontal Snap Scroll (User-controlled, zero auto-jump) */}
        <div
          ref={featuredScrollRef}
          onScroll={(e) => {
            const idx = Math.round(e.currentTarget.scrollLeft / 284);
            if (idx >= 0 && idx <= 8 && idx !== featuredIndex) {
              setFeaturedIndex(idx);
            }
          }}
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
                    {badgePercent(uni, profile.expectedScore || 24.5, hollandResult?.primaryCode)}% phù hợp
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
                      {formatTuitionRange(uni.tuitionMin, uni.tuitionMax, true)}
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
                onClick={() => scrollToFeatured(idx)}
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
                  onClick={() => {
                    setSelectedRegion(region);
                    setVisibleCount(10);
                  }}
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
            {filteredUniversities.slice(0, visibleCount).map((uni) => {
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
                    className="tabular-nums"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'var(--up-color-slate-50, #F8FAFC)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid var(--up-color-slate-100, #F1F5F9)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <span style={{ color: '#64748B' }}>Học phí:</span>
                      <strong style={{ color: 'var(--up-student-primary, #4F46E5)' }}>{formatTuitionRange(uni.tuitionMin, uni.tuitionMax, true)}</strong>
                    </div>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <span style={{ color: '#64748B' }}>Chuẩn ngành:</span>
                      <strong>{getCutoffRangeText(uni)}</strong>
                    </div>
                    <span style={{ color: '#CBD5E1' }}>•</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
                      <Briefcase size={12} color="var(--up-status-admitted-text, #059669)" />
                      <strong style={{ color: 'var(--up-status-admitted-text, #059669)' }}>{uni.employmentRate}% việc làm</strong>
                    </div>
                  </div>

                  {/* Bottom row: Compare action and detail */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                      {uni.majors.length} chuyên ngành
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(uni.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          backgroundColor: isComp ? '#EEF2FF' : '#F8FAFC',
                          border: isComp ? '1px solid var(--up-student-primary, #4F46E5)' : '1px solid #E2E8F0',
                          color: isComp ? 'var(--up-student-primary, #4F46E5)' : '#475569',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all var(--up-transition-fast, 150ms ease)',
                        }}
                      >
                        <Scale size={13} />
                        {isComp ? 'Đã chọn' : 'So sánh'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openUniDetail(uni.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--up-student-primary, #4F46E5)',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          transition: 'all var(--up-transition-fast, 150ms ease)',
                        }}
                      >
                        <span>Chi tiết</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Button: Xem thêm 10 trường tiếp theo */}
            {visibleCount < filteredUniversities.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 10)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '14px 18px',
                  borderRadius: '18px',
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  color: '#1D4ED8',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>Xem thêm 10 trường tiếp theo (Đang hiện {Math.min(visibleCount, filteredUniversities.length)}/{filteredUniversities.length} trường)</span>
                <span style={{ fontSize: '15px' }}>↓</span>
              </button>
            )}
          </div>
        )}

        <AppFooter text={`Đang hiển thị ${Math.min(visibleCount, filteredUniversities.length)}/${filteredUniversities.length} trường đại học`} />
      </div>

      {/* 7. Floating Compare Dock: Centered & Dismissible so it never overlaps right-aligned buttons */}
      {compareIds.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(84px + env(safe-area-inset-bottom, 12px))',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 75,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0F172A',
            padding: '5px 6px 5px 16px',
            borderRadius: '26px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.35)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <button
            onClick={openCompareModal}
            style={{
              height: '36px',
              padding: '0 10px 0 0',
              borderRadius: '18px',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Scale size={17} color="#60A5FA" />
            <span>So sánh ({compareIds.length}/3)</span>
          </button>
          <button
            type="button"
            onClick={clearCompare}
            aria-label="Xóa danh sách so sánh"
            title="Ẩn / Xóa danh sách so sánh"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.14)',
              color: '#E2E8F0',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
