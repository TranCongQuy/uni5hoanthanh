import React, { useState, useMemo } from 'react';
import {
  Laptop,
  Smartphone,
  Sparkles,
  Compass,
  Home,
  Radio,
  User,
  Search,
  Bell,
  Bot,
  Scale,
  GraduationCap,
  MapPin,
  TrendingUp,
  Award,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/MockData';
import { UniversityAvatar, Button } from '../common/UI';
import { QuizTab } from '../tabs/QuizTab';
import { MatchingTab } from '../tabs/MatchingTab';
import { LiveTab } from '../tabs/LiveTab';
import { ProfileTab } from '../tabs/ProfileTab';

export const DesktopView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setViewMode,
    user,
    isLoggedIn,
    loginDemo,
    openNotifications,
    openChatBot,
    openUniDetail,
    openCompareModal,
    isCompared,
    toggleCompare,
    favoriteIds,
    toggleFavorite,
    searchKeyword,
    setSearchKeyword,
  } = useApp();

  const [selectedRegion, setSelectedRegion] = useState<string>('Tất cả');
  const [localSearch, setLocalSearch] = useState<string>(searchKeyword);

  // Filter universities for desktop grid
  const filteredUnis = useMemo(() => {
    return UNIVERSITIES.filter((uni) => {
      const matchRegion = selectedRegion === 'Tất cả' || uni.region === selectedRegion;
      const matchQuery =
        !localSearch.trim() ||
        uni.name.toLowerCase().includes(localSearch.toLowerCase()) ||
        uni.code.toLowerCase().includes(localSearch.toLowerCase()) ||
        uni.loc.toLowerCase().includes(localSearch.toLowerCase()) ||
        uni.majors.some((m) => m.toLowerCase().includes(localSearch.toLowerCase()));
      return matchRegion && matchQuery;
    });
  }, [selectedRegion, localSearch]);

  const navLinks = [
    { id: 0, label: 'Trang chủ', icon: <Home size={18} /> },
    { id: 1, label: 'Khảo sát Holland', icon: <Compass size={18} /> },
    { id: 2, label: 'AI Matching', icon: <Sparkles size={18} /> },
    { id: 3, label: 'Sự kiện & Live', icon: <Radio size={18} /> },
    { id: 4, label: 'Hồ sơ xét tuyển', icon: <User size={18} /> },
  ];

  return (
    <div
      className="desktop-view-container"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* Logo & Edition Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              onClick={() => setActiveTab(0)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                <GraduationCap size={22} />
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: '#1E293B', lineHeight: 1.1 }}>
                  Uni<span style={{ color: '#2563EB' }}>Path</span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                  Phiên bản Laptop & Desktop
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Laptop size={13} />
              <span>DESKTOP MODE</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {navLinks.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: active ? '#EFF6FF' : 'transparent',
                    color: active ? '#2563EB' : '#475569',
                    fontSize: '13.5px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search bar & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick search input */}
            <div
              style={{
                position: 'relative',
                width: '240px',
                display: 'none',
              }}
              className="desktop-search-wrapper"
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchKeyword(e.target.value);
                }}
                placeholder="Tìm trường, ngành..."
                style={{
                  width: '100%',
                  height: '38px',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            {/* ONE-CLICK BUTTON TO SWITCH BACK TO MOBILE */}
            <button
              onClick={() => setViewMode('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
              }}
              title="Nhấn để chuyển sang màn hình điện thoại"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0F172A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B';
                e.currentTarget.style.transform = 'translateY(0px)';
              }}
            >
              <Smartphone size={16} />
              <span>Chuyển sang Mobile 📱</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={openNotifications}
              aria-label="Thông báo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                position: 'relative',
              }}
            >
              <Bell size={18} />
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#EF4444',
                }}
              />
            </button>

            {/* AI Chatbot */}
            <button
              onClick={openChatBot}
              aria-label="UniPath AI Assistant"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#2563EB',
              }}
            >
              <Bot size={18} />
            </button>

            {/* User Profile or Demo Login */}
            {isLoggedIn ? (
              <div
                onClick={() => setActiveTab(4)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {user.name.charAt(0)}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>{user.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Thí sinh THPT</div>
                </div>
              </div>
            ) : (
              <button
                onClick={loginDemo}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Đăng nhập Demo
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. DESKTOP MAIN CONTAINER */}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '24px',
          width: '100%',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        {/* Render Tab Contents or Dedicated Desktop Home */}
        {activeTab === 0 ? (
          <div>
            {/* ============================================================== */}
            {/* HERO TEST BANNER WITH THE REQUESTED "HELLO" MESSAGE           */}
            {/* ============================================================== */}
            <section
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #3B82F6 100%)',
                color: '#FFFFFF',
                padding: '36px 40px',
                boxShadow: '0 12px 36px rgba(37, 99, 235, 0.25)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '32px',
              }}
            >
              {/* Background ambient accents */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '260px',
                  height: '260px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-50px',
                  left: '20%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 2, maxWidth: '850px' }}>
                {/* Hello test badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  <Sparkles size={16} />
                  <span>DESKTOP MODE TEST: ACTIVE</span>
                </div>

                {/* THE PROMINENT "HELLO" HEADLINE */}
                <h1
                  style={{
                    fontSize: '34px',
                    fontWeight: 900,
                    letterSpacing: '-0.8px',
                    lineHeight: 1.25,
                    marginBottom: '14px',
                    color: '#FFFFFF',
                  }}
                >
                  👋 Hello! Chào mừng bạn đến với Giao diện Desktop / Laptop
                </h1>

                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: 1.6,
                    color: '#E0E7FF',
                    marginBottom: '24px',
                    fontWeight: 400,
                  }}
                >
                  Bạn đã kích hoạt thành công chế độ màn hình lớn dành riêng cho máy tính và laptop.
                  Tại đây, dữ liệu được trình bày dạng lưới rộng rãi, tối ưu cho việc tra cứu thông tin trường đại học,
                  làm khảo sát hướng nghiệp Holland và phân tích cơ hội trúng tuyển bằng AI.
                </p>

                {/* Test Action Buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                  {/* Button to toggle back to mobile */}
                  <button
                    onClick={() => setViewMode('mobile')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      color: '#1E3A8A',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <Smartphone size={18} />
                    <span>📱 Thử bấm chuyển về Mobile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(1)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Compass size={18} />
                    <span>Làm trắc nghiệm Holland</span>
                  </button>

                  <button
                    onClick={openChatBot}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '12px 22px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.16)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Bot size={18} />
                    <span>Mở Trợ lý AI Unipath</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 3. DESKTOP METRIC CARDS (4 COLUMNS) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
                marginBottom: '36px',
              }}
            >
              {/* Metric 1 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>100+</div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Trường Đại học chuẩn hóa</div>
                </div>
              </div>

              {/* Metric 2 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>94.8%</div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Tỉ lệ việc làm sau tốt nghiệp</div>
                </div>
              </div>

              {/* Metric 3 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFBEB',
                    color: '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Compass size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>6 Nhóm</div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Định hướng nghề RIASEC</div>
                </div>
              </div>

              {/* Metric 4 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#FAF5FF',
                    color: '#9333EA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>AI Match</div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Phân tích điểm chuẩn tự động</div>
                </div>
              </div>
            </div>

            {/* 4. DESKTOP UNIVERSITY EXPLORER */}
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                    Danh sách các trường Đại học tiêu biểu
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748B' }}>
                    Hiển thị {filteredUnis.length} trường đại học hàng đầu Việt Nam
                  </p>
                </div>

                {/* Region filters & Search */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Search input in toolbar */}
                  <div style={{ position: 'relative', width: '220px' }}>
                    <Search
                      size={15}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94A3B8',
                      }}
                    />
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      placeholder="Tìm trường, mã trường..."
                      style={{
                        width: '100%',
                        height: '36px',
                        paddingLeft: '32px',
                        paddingRight: '10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Region pills */}
                  {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: selectedRegion === reg ? '1px solid #2563EB' : '1px solid #CBD5E1',
                        backgroundColor: selectedRegion === reg ? '#2563EB' : '#FFFFFF',
                        color: selectedRegion === reg ? '#FFFFFF' : '#475569',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {reg === 'Tất cả' ? 'Toàn quốc' : `Miền ${reg}`}
                    </button>
                  ))}

                  {/* Open compare modal button */}
                  <button
                    onClick={openCompareModal}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#2563EB',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Scale size={15} />
                    <span>So sánh trường</span>
                  </button>
                </div>
              </div>

              {/* Desktop University Grid (3 columns on widescreen) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredUnis.slice(0, 9).map((uni) => {
                  const compared = isCompared(uni.id);
                  const isFav = favoriteIds.includes(uni.id);

                  return (
                    <div
                      key={uni.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '14px',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.04)';
                      }}
                    >
                      {/* Top Header of Card */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <UniversityAvatar code={uni.code} name={uni.name} size={50} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span
                              style={{
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '6px',
                              }}
                            >
                              {uni.code}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <MapPin size={12} />
                              {uni.loc}
                            </span>
                          </div>
                          <h3
                            style={{
                              fontSize: '15.5px',
                              fontWeight: 700,
                              color: '#1E293B',
                              lineHeight: 1.3,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {uni.name}
                          </h3>
                        </div>
                      </div>

                      {/* Info snippet */}
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748B',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {uni.desc}
                      </p>

                      {/* Specs pills */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '10px',
                          fontSize: '12px',
                        }}
                      >
                        <div>
                          <span style={{ color: '#64748B' }}>Điểm chuẩn 2024: </span>
                          <strong style={{ color: '#2563EB' }}>{uni.score2024} điểm</strong>
                        </div>
                        <div style={{ width: '1px', height: '14px', backgroundColor: '#CBD5E1' }} />
                        <div>
                          <span style={{ color: '#64748B' }}>Học phí: </span>
                          <strong style={{ color: '#059669' }}>{uni.tuitionMin}-{uni.tuitionMax} tr/năm</strong>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Button
                          variant="primary"
                          size="S"
                          onClick={() => openUniDetail(uni.id)}
                          style={{ flex: 1 }}
                        >
                          Xem chi tiết
                        </Button>

                        <button
                          onClick={() => toggleCompare(uni.id)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: compared ? '1px solid #2563EB' : '1px solid #CBD5E1',
                            backgroundColor: compared ? '#EFF6FF' : '#FFFFFF',
                            color: compared ? '#2563EB' : '#475569',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {compared ? 'Đã thêm' : 'So sánh'}
                        </button>

                        <button
                          onClick={() => toggleFavorite(uni.id)}
                          aria-label="Thêm vào yêu thích"
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: isFav ? '1px solid #FCA5A5' : '1px solid #CBD5E1',
                            backgroundColor: isFav ? '#FEF2F2' : '#FFFFFF',
                            color: isFav ? '#EF4444' : '#64748B',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {isFav ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. BOTTOM DESKTOP NOTICE BAR */}
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1E3A8A', marginBottom: '2px' }}>
                    UniPath - Nền tảng tư vấn tuyển sinh đại học hàng đầu
                  </h4>
                  <p style={{ fontSize: '13px', color: '#3B82F6' }}>
                    Hỗ trợ chuyển đổi giao diện linh hoạt giữa Laptop / PC và Điện thoại chỉ với 1 nút bấm.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewMode('mobile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Smartphone size={16} />
                <span>Chuyển về giao diện Điện thoại 📱</span>
              </button>
            </div>
          </div>
        ) : (
          /* Render the active tab inside wide desktop layout wrapper */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
              padding: '28px',
              minHeight: '75vh',
            }}
          >
            {/* Header for current active tab */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid #F1F5F9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {navLinks.find((t) => t.id === activeTab)?.icon}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>
                    {navLinks.find((t) => t.id === activeTab)?.label}
                  </h2>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Chế độ hiển thị màn hình rộng (Desktop View)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab(0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>Về Trang chủ Desktop</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Tab Body */}
            <div>
              {activeTab === 1 && <QuizTab />}
              {activeTab === 2 && <MatchingTab />}
              {activeTab === 3 && <LiveTab />}
              {activeTab === 4 && <ProfileTab />}
            </div>
          </div>
        )}
      </div>

      {/* 6. DESKTOP FOOTER */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '24px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#64748B',
          }}
        >
          <div>
            © 2026 <strong>UniPath Vietnam</strong>. Hệ thống hỗ trợ định hướng & tuyển sinh Đại học thế hệ mới.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span>Đang xem: 💻 Giao diện Laptop / Desktop</span>
            <button
              onClick={() => setViewMode('mobile')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Chuyển sang giao diện Mobile 📱
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
