import React, { useState } from 'react';
import {
  User,
  Settings,
  Crown,
  CheckCircle2,
  Calendar,
  Heart,
  ChevronRight,
  LogOut,
  Edit3,
  Trash2,
  Compass,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES, getHollandName } from '../../data/MockData';
import { Button, UniversityAvatar, AppFooter } from '../common/UI';
import { LineChart } from '../charts/LineChart';

export const ProfileTab: React.FC = () => {
  const {
    isGuest,
    user,
    profile,
    bookings,
    favoriteIds,
    toggleFavorite,
    hollandResult,
    upgradePremium,
    logout,
    openUniDetail,
    openEditProfile,
    openSettings,
    openCareerPath,
    openAuthModal,
  } = useApp();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Favorite universities objects
  const favoriteUnis = UNIVERSITIES.filter((u) => favoriteIds.includes(u.id));

  const handleConfirmUpgrade = () => {
    upgradePremium('Gói Không Giới Hạn');
    setShowUpgradeModal(false);
  };

  return (
    <div style={{ padding: '20px 20px 104px', display: 'flex', flexDirection: 'column' }}>
      {/* 1. User Info Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: profile.isPremium ? '3px solid #F59E0B' : '2px solid #2563EB',
              boxShadow: '0 4px 12px rgba(37,99,235,0.15)',
              backgroundColor: '#EFF6FF',
              flexShrink: 0,
            }}
          >
            <img
              src={profile.avatarPath || '/images/avatar_user.png'}
              alt={user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.name || 'Học sinh Unipath'}
              </h3>
              {profile.isPremium && (
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <Crown size={12} /> PRO
                </span>
              )}
            </div>

            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              {isGuest ? 'Tài khoản khách trải nghiệm' : `${profile.grade} • ${profile.school}`}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              {profile.province}
            </div>
          </div>

          <button
            onClick={openSettings}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              flexShrink: 0,
            }}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Target goal pill & Action buttons */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '14px',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12px', color: '#1E40AF', lineHeight: 1.4 }}>
            <strong>Mục tiêu:</strong> {profile.targetMajor} — {profile.dreamUni}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isGuest ? (
            <Button
              variant="primary"
              size="M"
              fullWidth
              onClick={openAuthModal}
            >
              Đăng nhập / Đăng ký tài khoản
            </Button>
          ) : (
            <Button
              variant="tonal"
              size="M"
              fullWidth
              icon={<Edit3 size={16} />}
              onClick={openEditProfile}
            >
              Chỉnh sửa thông tin hồ sơ
            </Button>
          )}
        </div>
      </div>

      {/* 2. Unipath Premium Banner Card with Flame Effect */}
      {!profile.isPremium ? (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 45%, #FDE68A 100%)',
            border: '2px solid #F59E0B',
            borderRadius: '26px',
            padding: '22px 20px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(245, 158, 11, 0.25), 0 0 15px rgba(239, 68, 68, 0.15)',
          }}
        >
          {/* Shimmering light beam across the card */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '40%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              animation: 'shimmerBeam 3.5s infinite linear',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Header row: Crown + Title + -50% Flame badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)',
                  border: '1.5px solid #FCD34D',
                  animation: 'floatBob 3s ease-in-out infinite',
                }}
              >
                <Crown size={26} fill="#F59E0B" color="#B45309" />
              </div>
              <div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#78350F' }}>
                  Unipath Premium
                </span>
                <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600 }}>
                  Gói quyền lợi hướng nghiệp trọn gói
                </div>
              </div>
            </div>

            {/* BỐC LỬA -50% FLAME BADGE */}
            <div
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 900,
                padding: '5px 12px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                animation: 'fireFlicker 1.6s infinite ease-in-out',
                letterSpacing: '0.3px',
                cursor: 'pointer',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                border: '1px solid #FECACA',
              }}
            >
              <span style={{ fontSize: '15px' }}>🔥</span>
              <span>-50% GIẢM SỐC</span>
            </div>
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px', position: 'relative', zIndex: 2 }}>
            <span
              style={{
                fontSize: '34px',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #B45309 0%, #D97706 60%, #78350F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              199.000đ
            </span>
            <span style={{ fontSize: '14px', color: '#78350F', fontWeight: 700 }}>/năm</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                fontWeight: 800,
                color: '#DC2626',
                backgroundColor: '#FEE2E2',
                padding: '3px 8px',
                borderRadius: '8px',
                border: '1px solid #FECACA',
              }}
            >
              ⚡ Ưu đãi chỉ hôm nay
            </span>
          </div>

          <div style={{ fontSize: '14px', color: '#92400E', textDecoration: 'line-through', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
            399.000đ/năm
          </div>

          {/* 4 Benefits with green checks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
            {[
              'Bộ đề & Tài liệu ôn thi ĐGNL độc quyền',
              'Tư vấn 1-1 trực tiếp cùng chuyên gia tuyển sinh',
              'Phân tích cơ hội đỗ AI không giới hạn số trường',
              'Giao diện siêu tốc, không quảng cáo làm phiền',
            ].map((text, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(16,185,129,0.3)',
                  }}
                >
                  <CheckCircle2 size={14} />
                </div>
                <span style={{ fontSize: '13px', color: '#78350F', fontWeight: 600 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Upgrade Button with Shine Effect */}
          <button
            onClick={() => setShowUpgradeModal(true)}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4), 0 0 10px rgba(245, 158, 11, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '30%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmerBeam 2.5s infinite linear',
              }}
            />
            <span>🔥 Nâng cấp ngay — Mở khóa trọn bộ</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      ) : (
        /* Already Premium Card */
        <div
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: '#FFFFFF',
            marginBottom: '24px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Crown size={24} color="#FDE68A" />
            <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>
              Hội viên Unipath VIP Premium
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9 }}>
            Bạn đang sử dụng trọn vẹn toàn bộ tính năng cao cấp của Unipath đến 2027.
          </p>
        </div>
      )}

      {/* 3. Parent / Student Dashboard: Tiến độ ĐGNL */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '24px',
        }}
      >
        <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
          Dashboard Theo dõi Năng lực THPT
        </h4>

        {/* 3 stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px' }}>
          <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#2563EB' }}>855</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Điểm ĐGNL</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>18</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Đề đã làm</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#F59E0B' }}>{favoriteIds.length}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Mục tiêu</div>
          </div>
        </div>

        {/* Line Chart */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block', marginBottom: '8px' }}>
            Tiến độ điểm thi Đánh giá năng lực theo tháng:
          </span>
          <LineChart height={130} />
        </div>
      </div>

      {/* 4. Holland RIASEC Result Summary */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#2563EB" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Kết quả trắc nghiệm RIASEC
            </h4>
          </div>
          {hollandResult && (
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>{hollandResult.completedAt}</span>
          )}
        </div>

        {hollandResult ? (
          <div>
            <div
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '16px',
                padding: '12px 14px',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1D4ED8' }}>
                Mã {hollandResult.primaryCode} — {getHollandName(hollandResult.primaryCode)}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Top 3 nhóm nổi trội: {hollandResult.topCodes.join(' - ')}
              </div>
            </div>
            <Button
              variant="tonal"
              size="M"
              fullWidth
              onClick={() => openCareerPath(hollandResult.primaryCode)}
            >
              Xem lộ trình phát triển nghề nghiệp
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B' }}>
              Bạn chưa hoàn thành bài khảo sát tính cách nào.
            </p>
            <Button variant="tonal" size="M" onClick={() => (window.location.hash = '#quiz')}>
              Làm trắc nghiệm ngay
            </Button>
          </div>
        )}
      </div>

      {/* 5. Wishlist (Trường yêu thích) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#EF4444" fill="#EF4444" />
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Trường đã lưu ({favoriteUnis.length})
            </h4>
          </div>
        </div>

        {favoriteUnis.length === 0 ? (
          <div
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
            }}
          >
            <Heart size={28} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              Chưa có trường nào được lưu. Bấm biểu tượng trái tim để lưu trường bạn yêu thích!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '6px',
            }}
          >
            {favoriteUnis.map((uni) => (
              <div
                key={uni.id}
                onClick={() => openUniDetail(uni.id)}
                style={{
                  minWidth: '220px',
                  width: '220px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  padding: '12px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <UniversityAvatar code={uni.code} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
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
                      {uni.code} • {uni.region}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', marginBottom: '8px' }}>
                  {uni.tuitionMin} - {uni.tuitionMax} tr/năm
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(uni.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF2F2',
                    color: '#EF4444',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <Trash2 size={12} /> Bỏ lưu
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. My Consultation Appointments */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
          Lịch tư vấn 1-1 của bạn ({bookings.length})
        </h4>

        {bookings.length === 0 ? (
          <div
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
            }}
          >
            <Calendar size={28} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              Bạn chưa có lịch hẹn tư vấn nào.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '14px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    Đã xác nhận lịch
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{b.dateTime}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                  Tư vấn tuyển sinh trường {b.uniCode}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Ngành quan tâm: {b.major}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Action Menu Links */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          marginBottom: '24px',
        }}
      >
        {[
          { label: 'Thông tin cá nhân', icon: <User size={18} color="#2563EB" />, action: openEditProfile },
          { label: 'Lộ trình định hướng THPT', icon: <FileText size={18} color="#10B981" />, action: () => openCareerPath() },
          { label: 'Cài đặt & Tùy chọn', icon: <Settings size={18} color="#64748B" />, action: openSettings },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: idx < 2 ? '1px solid #F1F5F9' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>
                {item.label}
              </span>
            </div>
            <ChevronRight size={18} color="#CBD5E1" />
          </div>
        ))}
      </div>

      {/* Logout button */}
      <Button
        variant="outline"
        size="L"
        fullWidth
        style={{ borderColor: '#EF4444', color: '#EF4444' }}
        icon={<LogOut size={18} />}
        onClick={() => setShowLogoutConfirm(true)}
      >
        Đăng xuất tài khoản
      </Button>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
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
              maxWidth: '380px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                margin: '0 auto 16px',
              }}
            >
              <Crown size={32} />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800 }}>
              Xác nhận Nâng cấp Premium
            </h4>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>
              (Chế độ trải nghiệm Demo: Không phát sinh thanh toán thật)
            </p>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                padding: '12px',
                borderRadius: '16px',
                marginBottom: '20px',
                textAlign: 'left',
                fontSize: '13px',
              }}
            >
              <div>• Gói: Hội viên Unipath Trọn Đời</div>
              <div>• Giá ưu đãi: 199.000đ</div>
              <div>• Trạng thái: Kích hoạt ngay lập tức</div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="M"
                fullWidth
                onClick={() => setShowUpgradeModal(false)}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                size="M"
                fullWidth
                onClick={handleConfirmUpgrade}
              >
                Kích hoạt ngay
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
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
              Bạn muốn đăng xuất?
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748B' }}>
              Bạn có thể đăng nhập lại bất kỳ lúc nào bằng tài khoản demo hoặc tài khoản đã đăng ký.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="M"
                fullWidth
                onClick={() => setShowLogoutConfirm(false)}
              >
                Ở lại
              </Button>
              <Button
                variant="danger"
                size="M"
                fullWidth
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppFooter text="Unipath v2.0 • Chế độ trải nghiệm" />
    </div>
  );
};
