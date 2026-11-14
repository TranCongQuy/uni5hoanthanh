import React, { useState } from 'react';
import {
  User,
  Settings,
  Crown,
  Heart,
  ChevronRight,
  LogOut,
  Edit3,
  Trash2,
  Compass,
  FileText,
  Calendar,
  LogIn,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getHollandName } from '../../data/MockData';
import { getStatusMeta } from '../../types';
import type { ApplicationRecord } from '../../types';
import { canStudentCancelApplication, computeHollandAssessment } from '../../services/ApplicationWorkflow';
import { formatTuitionRange } from '../../utils/validation';
import { Button, UniversityAvatar, AppFooter } from '../common/UI';
import { AccountRoleMenu } from '../common/AccountRoleMenu';
import { LineChart } from '../charts/LineChart';

export const ProfileTab: React.FC = () => {
  const {
    isLoggedIn,
    isGuest,
    user,
    profile,
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
    openBookConsultation,
    myApplications,
    myBookings,
    bookingStates,
    openApplicationDetail,
    openAllApplications,
    cancelApplication,
    setActiveTab,
    universitiesList,
  } = useApp();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [pendingCancelApp, setPendingCancelApp] = useState<ApplicationRecord | null>(null);
  const [subTab, setSubTab] = useState<'apps' | 'bookings' | 'saved'>('apps');

  // Favorite universities objects
  const favoriteUnis = universitiesList.filter((u) => favoriteIds.includes(u.id));
  const admittedApp = myApplications.find((a) => a.status === 'Đã trúng tuyển');
  const missingDocApp = myApplications.find((a) => a.status === 'Thiếu hồ sơ');

  const handleConfirmUpgrade = () => {
    upgradePremium('Gói Không Giới Hạn');
    setShowUpgradeModal(false);
  };

  return (
    <div style={{ padding: '16px 18px 132px', display: 'flex', flexDirection: 'column' }}>
      {/* 1. User Info Header Card with Account & 1-Click Role Menu */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '22px',
          padding: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
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
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {isLoggedIn && !isGuest ? (user.name || 'Học sinh UniPath') : 'Khách trải nghiệm'}
              </h3>
              {profile.isPremium && isLoggedIn && !isGuest && (
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    flexShrink: 0,
                  }}
                >
                  <Crown size={11} /> VIP
                </span>
              )}
            </div>

            <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {!isLoggedIn || isGuest ? 'Tài khoản khách trải nghiệm' : `${profile.grade} • ${profile.school}`}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '1px' }}>
              {profile.province}
            </div>
          </div>

          <AccountRoleMenu variant="light" compact />
        </div>

        {/* Target goal pill */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: '12px',
            padding: '9px 12px',
            marginBottom: '12px',
            fontSize: '12px',
            color: '#1E40AF',
            lineHeight: 1.4,
          }}
        >
          <strong>Mục tiêu:</strong> {profile.targetMajor} — {profile.dreamUni}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!isLoggedIn || isGuest ? (
            <Button variant="primary" size="M" fullWidth onClick={openAuthModal}>
              Đăng nhập / Đăng ký tài khoản
            </Button>
          ) : (
            <Button variant="tonal" size="M" fullWidth icon={<Edit3 size={16} />} onClick={openEditProfile}>
              Chỉnh sửa thông tin hồ sơ
            </Button>
          )}
        </div>
      </div>

      {/* 2. Priority Action Alerts (Early Admission Certificate / Supplement Required) */}
      {isLoggedIn && !isGuest && admittedApp && (
        <div
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1.5px solid #6EE7B7',
            borderRadius: '18px',
            padding: '14px 16px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', backgroundColor: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#065F46' }}>
                🎉 Chúc mừng Đã trúng tuyển sớm!
              </div>
              <div style={{ fontSize: '11.5px', color: '#047857', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admittedApp.uniName} • {admittedApp.major}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openApplicationDetail(admittedApp)}
            style={{
              padding: '7px 11px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Xem giấy báo
          </button>
        </div>
      )}

      {isLoggedIn && !isGuest && missingDocApp && (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #FCD34D',
            borderRadius: '18px',
            padding: '14px 16px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '11px', backgroundColor: '#D97706', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={19} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                Cần bổ sung minh chứng ({missingDocApp.code})
              </div>
              <div style={{ fontSize: '11.5px', color: '#B45309', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {missingDocApp.uniName} đang chờ bạn cập nhật
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => openApplicationDetail(missingDocApp)}
            style={{
              padding: '7px 11px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Bổ sung ngay
          </button>
        </div>
      )}

      {/* 3. Clean 3-Sub-Tab Switcher ("Nhìn 3 Giây Hiểu Ngay") */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          padding: '5px',
          backgroundColor: '#E2E8F0',
          borderRadius: '15px',
          marginBottom: '18px',
        }}
      >
        {[
          { id: 'apps' as const, label: `Hồ sơ (${myApplications.length})` },
          { id: 'bookings' as const, label: `Lịch 1-1 (${myBookings.length})` },
          { id: 'saved' as const, label: `Đã lưu (${favoriteUnis.length})` },
        ].map((tab) => {
          const active = subTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              style={{
                padding: '9px 6px',
                borderRadius: '11px',
                border: 'none',
                backgroundColor: active ? '#FFFFFF' : 'transparent',
                color: active ? '#2563EB' : '#475569',
                fontSize: '12px',
                fontWeight: active ? 800 : 700,
                cursor: 'pointer',
                boxShadow: active ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: SUBMITTED APPLICATIONS */}
      {subTab === 'apps' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#2563EB" />
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Hồ sơ xét tuyển ({myApplications.length})
              </h4>
            </div>
            {myApplications.length > 0 && (
              <button
                onClick={openAllApplications}
                style={{
                  border: 'none',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: 800,
                  padding: '5px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                }}
              >
                Mở toàn màn hình →
              </button>
            )}
          </div>

          {myApplications.length === 0 ? (
            <div
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1',
              }}
            >
              <FileText size={28} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B' }}>
                {!isLoggedIn || isGuest
                  ? 'Đăng nhập tài khoản thí sinh để nộp và theo dõi hồ sơ xét tuyển đại học trực tuyến.'
                  : 'Bạn chưa nộp hồ sơ xét tuyển nào. Hãy chọn trường và nộp hồ sơ trực tuyến ngay!'}
              </p>
              <Button
                variant="tonal"
                size="M"
                onClick={() => (!isLoggedIn || isGuest ? openAuthModal() : setActiveTab(0))}
              >
                {!isLoggedIn || isGuest ? 'Đăng nhập ngay' : 'Khám phá trường ngay'}
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myApplications.map((app) => {
                const meta = getStatusMeta(app.status);
                return (
                  <div
                    key={app.id}
                    onClick={() => openApplicationDetail(app)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #E2E8F0',
                      padding: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '8px' }}>
                        {app.code}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: meta.color,
                          backgroundColor: meta.bg,
                          border: `1px solid ${meta.border}`,
                          padding: '3px 8px',
                          borderRadius: '8px',
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <UniversityAvatar code={app.uniCode} size={38} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {app.uniName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          {app.major}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '12px', gap: '8px' }}>
                      <span style={{ color: '#94A3B8' }}>
                        Nộp lúc: {app.submittedAt}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {canStudentCancelApplication(app, user.email, isGuest || !isLoggedIn).ok && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingCancelApp(app);
                            }}
                            style={{
                              border: '1px solid #FECACA',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              padding: '4px 9px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                            }}
                          >
                            Rút hồ sơ
                          </button>
                        )}
                        <span style={{ color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {app.status === 'Thiếu hồ sơ' ? 'Bổ sung ngay' : 'Chi tiết'} <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: 1-1 CONSULTATION BOOKINGS */}
      {subTab === 'bookings' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#0D9488" />
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Lịch hẹn tư vấn 1-1 ({myBookings.length})
              </h4>
            </div>
            <button
              onClick={() => openBookConsultation()}
              style={{
                border: 'none',
                backgroundColor: '#F0FDFA',
                color: '#0D9488',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 10px',
                borderRadius: '10px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              + Đặt lịch mới
            </button>
          </div>

          {myBookings.length === 0 ? (
            <div
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1',
              }}
            >
              <Calendar size={26} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B' }}>
                Đặt lịch gặp gỡ trực tiếp 1-1 cùng giảng viên và ban tuyển sinh các trường đại học.
              </p>
              <Button variant="tonal" size="M" onClick={() => openBookConsultation()}>
                Đặt lịch tư vấn 1-1 ngay
              </Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myBookings.map((bk) => {
                const st = bookingStates[bk.id] || 'pending';
                const badge =
                  st === 'done'
                    ? { label: 'Hoàn thành', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' }
                    : st === 'contacted'
                    ? { label: 'Đã liên hệ', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
                    : { label: 'Chờ liên hệ', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };

                return (
                  <div
                    key={bk.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '18px',
                      border: '1px solid #E2E8F0',
                      padding: '14px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                        {bk.uniName || `Trường ${bk.uniCode}`} ({bk.uniCode})
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: badge.color,
                          backgroundColor: badge.bg,
                          border: `1px solid ${badge.border}`,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          flexShrink: 0,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 700, marginBottom: '4px' }}>
                      Ngành tư vấn: {bk.major}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      🕒 {bk.dateTime} {bk.channel ? `• ${bk.channel}` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: SAVED UNIVERSITIES, HOLLAND & THPT ROADMAP */}
      {subTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {/* Saved Wishlist */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Heart size={20} color="#EF4444" fill="#EF4444" />
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                Trường đã lưu ({favoriteUnis.length})
              </h4>
            </div>

            {favoriteUnis.length === 0 ? (
              <div
                style={{
                  padding: '22px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '1px dashed #CBD5E1',
                }}
              >
                <Heart size={26} color="#CBD5E1" style={{ margin: '0 auto 8px' }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Chưa có trường nào được lưu. Bấm biểu tượng trái tim để lưu trường bạn yêu thích!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
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
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <UniversityAvatar code={uni.code} size={40} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {uni.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {uni.code} • {uni.region}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB', marginBottom: '8px' }}>
                      {formatTuitionRange(uni.tuitionMin, uni.tuitionMax, true)}
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

          {/* Holland RIASEC Result Summary */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '22px',
              padding: '18px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="#2563EB" />
                <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>
                  Định hướng Holland RIASEC
                </h4>
              </div>
              {hollandResult && (
                <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>{hollandResult.completedAt}</span>
              )}
            </div>

            {hollandResult ? (() => {
              const ha = computeHollandAssessment(hollandResult.scores);
              return (
                <div>
                  <div style={{ backgroundColor: '#EFF6FF', borderRadius: '14px', padding: '12px 14px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#1D4ED8' }}>
                      Mã {ha.primaryCode} — {getHollandName(ha.primaryCode)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      {ha.tiedTopCodes.length > 1
                        ? `Đồng hạng cao nhất: ${ha.tiedTopCodes.join(' & ')} • Nổi trội: ${ha.topCodes.join(' - ')}`
                        : `Nhóm nổi trội: ${ha.topCodes.join(' - ')}`}
                    </div>
                  </div>
                  <Button variant="tonal" size="M" fullWidth onClick={() => openCareerPath(ha.primaryCode)}>
                    Xem lộ trình nghề nghiệp THPT
                  </Button>
                </div>
              );
            })() : (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748B' }}>
                  Bạn chưa hoàn thành bài khảo sát tính cách nào.
                </p>
                <Button variant="tonal" size="M" onClick={() => setActiveTab(1)}>
                  Làm trắc nghiệm ngay
                </Button>
              </div>
            )}
          </div>

          {/* Dashboard Theo dõi Năng lực THPT */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '22px',
              padding: '18px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <h4 style={{ margin: '0 0 12px', fontSize: '15.5px', fontWeight: 800, color: '#0F172A' }}>
              Theo dõi Năng lực THPT
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#2563EB' }}>855</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Điểm ĐGNL</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#10B981' }}>18</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Đề đã làm</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#F59E0B' }}>{favoriteIds.length}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Mục tiêu</div>
              </div>
            </div>
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B', display: 'block', marginBottom: '8px' }}>
                Tiến độ điểm thi Đánh giá năng lực theo tháng:
              </span>
              <LineChart height={125} />
            </div>
          </div>

          {/* Compact UniPath VIP Card */}
          <div
            style={{
              background: profile.isPremium
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              borderRadius: '22px',
              padding: '18px',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(217, 119, 6, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Crown size={20} color="#FDE68A" />
              <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 800 }}>
                {profile.isPremium ? 'Hội viên UniPath VIP Đã Kích Hoạt' : 'Nâng cấp Hội viên UniPath VIP'}
              </h4>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', opacity: 0.92, lineHeight: 1.5 }}>
              {profile.isPremium
                ? 'Bạn đã mở khóa ưu tiên xếp lịch tư vấn 1-1 và trọn bộ phân tích chuyên sâu 30 trường.'
                : 'Mở khóa ưu tiên xếp lịch tư vấn 1-1 cùng chuyên gia và báo cáo phân tích sâu (Demo miễn phí).'}
            </p>
            {!profile.isPremium && (
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#B45309',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Kích hoạt Gói VIP (Demo) →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. Action Menu Links */}
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
          { label: 'Lộ trình định hướng THPT', icon: <FileText size={18} color="#10B981" />, action: () => openCareerPath(hollandResult?.primaryCode) },
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

      {/* Logout or Login button */}
      {!isLoggedIn || isGuest ? (
        <Button
          variant="primary"
          size="L"
          fullWidth
          icon={<LogIn size={18} />}
          onClick={openAuthModal}
        >
          Đăng nhập / Tạo tài khoản thí sinh
        </Button>
      ) : (
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
      )}

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

      {/* In-app Cancel Application Confirmation Modal */}
      {pendingCancelApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1050,
          }}
          onClick={() => setPendingCancelApp(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Xác nhận rút hồ sơ xét tuyển?
            </h4>
            <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
              Bạn sắp rút nguyện vọng <strong>{pendingCancelApp.code}</strong> ({pendingCancelApp.major} — {pendingCancelApp.uniName}). Hồ sơ đã rút sẽ chuyển sang trạng thái kết thúc và không thể khôi phục.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" size="M" fullWidth onClick={() => setPendingCancelApp(null)}>
                Giữ lại
              </Button>
              <Button
                variant="danger"
                size="M"
                fullWidth
                onClick={() => {
                  const id = pendingCancelApp.id;
                  setPendingCancelApp(null);
                  cancelApplication(id);
                }}
              >
                Xác nhận rút hồ sơ
              </Button>
            </div>
          </div>
        </div>
      )}

      <AppFooter text="Đồng hành cùng học sinh THPT và quý phụ huynh trên hành trình chọn ngành, chọn trường và kiến tạo tương lai nghề nghiệp vững chắc." />
    </div>
  );
};
