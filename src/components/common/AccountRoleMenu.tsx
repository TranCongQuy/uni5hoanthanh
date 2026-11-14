import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  LogIn,
  Settings,
  ShieldCheck,
  School,
  GraduationCap,
  Check,
  RotateCcw,
  Lock,
  FlaskConical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AccountRoleMenuProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const AccountRoleMenu: React.FC<AccountRoleMenuProps> = ({
  variant = 'light',
  compact = false,
}) => {
  const {
    isLoggedIn,
    isGuest,
    user,
    isDemoMode,
    toggleDemoMode,
    demoQuickSwitch,
    logout,
    openAuthModal,
    openSettings,
    resetPersonalData,
    resetAllData,
  } = useApp();

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const roleMeta =
    !isLoggedIn || isGuest
      ? { label: 'Khách trải nghiệm', badgeBg: '#F1F5F9', badgeColor: '#475569', accent: '#2563EB' }
      : user.role === 'admin'
      ? { label: 'Admin Hệ thống', badgeBg: '#EEF2FF', badgeColor: '#4338CA', accent: '#4F46E5' }
      : user.role === 'university_pxu'
      ? { label: 'Tuyển sinh PXU', badgeBg: '#ECFDF5', badgeColor: '#047857', accent: '#059669' }
      : { label: 'Thí sinh THPT', badgeBg: '#EFF6FF', badgeColor: '#1D4ED8', accent: '#2563EB' };

  const handleRoleSelect = (email: string, target: 'student' | 'pxu' | 'admin') => {
    setOpen(false);
    if (isLoggedIn && !isGuest && user.email.trim().toLowerCase() === email.toLowerCase()) {
      return;
    }
    if (isDemoMode) {
      demoQuickSwitch(target);
    } else {
      openAuthModal(email);
    }
  };

  const isCurrentEmail = (email: string) =>
    isLoggedIn && !isGuest && user.email.trim().toLowerCase() === email.toLowerCase();

  const isDark = variant === 'dark';

  return (
    <div ref={wrapRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu tài khoản và phân quyền"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: compact ? '6px' : '8px',
          padding: compact ? '4px 8px 4px 5px' : '5px 11px 5px 6px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255,255,255,0.24)' : '1px solid #E2E8F0',
          backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
          color: isDark ? '#FFFFFF' : '#0F172A',
          cursor: 'pointer',
          boxShadow: isDark ? 'none' : '0 1px 3px rgba(15, 23, 42, 0.04)',
          maxWidth: compact ? '156px' : '248px',
          transition: 'all 0.15s ease',
        }}
      >
        <span
          style={{
            width: compact ? '26px' : '30px',
            height: compact ? '26px' : '30px',
            borderRadius: '9px',
            backgroundColor: isDark ? 'rgba(255,255,255,0.22)' : roleMeta.accent,
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {!isLoggedIn || isGuest ? 'K' : (user.name || 'U').charAt(0).toUpperCase()}
        </span>

        {!compact && (
          <span
            style={{
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'left',
              lineHeight: 1.2,
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: isDark ? '#FFFFFF' : '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {!isLoggedIn || isGuest ? 'Tài khoản' : user.name}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.85)' : roleMeta.badgeColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {roleMeta.label}
              {isDemoMode ? ' · DEMO' : ''}
            </span>
          </span>
        )}

        <ChevronDown
          size={14}
          style={{
            flexShrink: 0,
            opacity: 0.75,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '312px',
            maxWidth: 'calc(100vw - 24px)',
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.16), 0 4px 12px rgba(15, 23, 42, 0.06)',
            padding: '12px',
            zIndex: 1200,
            animation: 'popScaleIn 0.16s ease-out',
            color: '#0F172A',
          }}
        >
          {/* Current User Identity */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #F1F5F9',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                marginBottom: '3px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#0F172A',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {!isLoggedIn || isGuest ? 'Khách trải nghiệm' : user.name}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  backgroundColor: roleMeta.badgeBg,
                  color: roleMeta.badgeColor,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {roleMeta.label}
              </span>
            </div>
            <div
              style={{
                fontSize: '11.5px',
                color: '#64748B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {!isLoggedIn || isGuest ? 'Chưa đăng nhập tài khoản định danh' : user.email}
            </div>
          </div>

          {/* Demo Sandbox Toggle (OFF by default -> requires password!) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '11px',
              backgroundColor: isDemoMode ? '#FFFBEB' : '#F8FAFC',
              border: isDemoMode ? '1px solid #FCD34D' : '1px solid #E2E8F0',
              marginBottom: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
              <FlaskConical size={14} color={isDemoMode ? '#D97706' : '#64748B'} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A' }}>
                  Chế độ Kiểm thử Demo
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>
                  {isDemoMode ? 'Đang bật chuyển nhanh Sandbox' : 'Đang tắt — Bắt buộc mật khẩu'}
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={toggleDemoMode}
              aria-label="Bật chế độ kiểm thử Demo"
              style={{ width: '17px', height: '17px', cursor: 'pointer', accentColor: '#D97706', flexShrink: 0 }}
            />
          </div>

          <div
            style={{
              padding: '2px 4px 6px',
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
            }}
          >
            {isDemoMode
              ? '🧪 [DEMO SANDBOX] Chuyển nhanh vai trò'
              : '🔒 Cổng phân quyền (Xác thực mật khẩu)'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
            {[
              {
                email: 'quy@unipath.vn',
                target: 'student' as const,
                title: 'Thí sinh: Trần Công Quý',
                sub: 'Cổng Học sinh THPT (5 phân hệ)',
                icon: <GraduationCap size={15} color="#2563EB" />,
                iconBg: '#EFF6FF',
              },
              {
                email: 'tuyensinh@pxu.edu.vn',
                target: 'pxu' as const,
                title: 'ĐH Phú Xuân (PXU)',
                sub: 'CRM Tuyển sinh & OJT (Cô lập PXU)',
                icon: <School size={15} color="#059669" />,
                iconBg: '#ECFDF5',
              },
              {
                email: 'admin@unipath.vn',
                target: 'admin' as const,
                title: 'Admin Hệ thống',
                sub: 'Quản trị 30 trường ĐH toàn quốc',
                icon: <ShieldCheck size={15} color="#4F46E5" />,
                iconBg: '#EEF2FF',
              },
            ].map((item) => {
              const active = isCurrentEmail(item.email);
              return (
                <button
                  key={item.email}
                  type="button"
                  onClick={() => handleRoleSelect(item.email, item.target)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '11px',
                    border: active ? '1.5px solid #BFDBFE' : '1px solid transparent',
                    backgroundColor: active ? '#F8FAFF' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.14s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '9px',
                      backgroundColor: item.iconBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        color: '#0F172A',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: '#64748B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.sub}
                    </span>
                  </span>
                  {active ? (
                    <Check size={15} color="#2563EB" strokeWidth={3} style={{ flexShrink: 0 }} />
                  ) : !isDemoMode ? (
                    <Lock size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '6px 0' }} />

          {/* Utility & Auth Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openSettings();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={15} color="#64748B" />
              <span>Cài đặt & Thông tin dự án</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                if (user.role === 'admin' || isDemoMode) {
                  resetAllData();
                } else {
                  resetPersonalData();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'transparent',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <RotateCcw size={15} color="#64748B" />
              <span>
                {user.role === 'admin' || isDemoMode
                  ? 'Khôi phục dữ liệu mẫu hệ thống'
                  : 'Đặt lại dữ liệu cá nhân của tôi'}
              </span>
            </button>

            {!isLoggedIn || isGuest ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAuthModal();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  marginTop: '4px',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <LogIn size={15} />
                <span>Đăng nhập / Đăng ký tài khoản</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={15} color="#DC2626" />
                <span>Đăng xuất tài khoản ngay</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
