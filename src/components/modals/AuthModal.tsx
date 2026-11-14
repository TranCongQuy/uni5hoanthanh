import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User, CheckSquare, Square, FlaskConical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authPrefillEmail,
    isDemoMode,
    toggleDemoMode,
    demoQuickSwitch,
    login,
    register,
    loginAsGuest,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMsg('');
      setPassword('');
      setConfirmPassword('');
      if (authPrefillEmail) {
        setMode('login');
        setEmail(authPrefillEmail);
        setTimeout(() => passwordRef.current?.focus(), 60);
      }
    }
  }, [isAuthModalOpen, authPrefillEmail]);

  if (!isAuthModalOpen) return null;

  const selectAccountForAuth = (targetEmail: string, demoTarget: 'student' | 'admin' | 'pxu') => {
    if (isDemoMode) {
      demoQuickSwitch(demoTarget);
      return;
    }
    setMode('login');
    setEmail(targetEmail);
    setPassword('');
    setErrorMsg('');
    setTimeout(() => passwordRef.current?.focus(), 40);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin xác thực!');
      }
    }, 350);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp!');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản sử dụng!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = register(fullName, email, password);
      if (!res.ok) {
        setErrorMsg(res.error || 'Không thể đăng ký tài khoản với thông tin này!');
      }
    }, 350);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={closeAuthModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '448px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Đóng hộp thoại đăng nhập"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.85)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            color: '#1E293B',
          }}
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Hero Banner Header */}
          <div
            style={{
              height: '144px',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #06B6D4 100%)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFFFFF',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <img
                src="/images/logo_unipath.png"
                alt="Logo"
                style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px' }}>
                UNIPATH
              </span>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.92 }}>
              Xác thực tài khoản & Phân quyền vai trò an toàn
            </span>
          </div>

          <div style={{ padding: '20px' }}>
            {/* Segmented Switcher (Đăng nhập | Đăng ký) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                backgroundColor: '#F1F5F9',
                borderRadius: '16px',
                padding: '4px',
                marginBottom: '18px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                style={{
                  height: '40px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
                  color: mode === 'login' ? '#2563EB' : '#64748B',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                style={{
                  height: '40px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
                  color: mode === 'register' ? '#2563EB' : '#64748B',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                Đăng ký
              </button>
            </div>

            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email tài khoản
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nhap-email@unipath.vn"
                      required
                      autoComplete="email"
                      spellCheck={false}
                      inputMode="email"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 16px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Mật khẩu xác thực
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={passwordRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      required
                      autoComplete="current-password"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 42px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="L"
                  fullWidth
                  loading={loading}
                  style={{ marginTop: '4px' }}
                >
                  Đăng nhập xác thực →
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Họ và tên thí sinh
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      required
                      autoComplete="name"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 16px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email cá nhân
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hocsinh@example.com"
                      required
                      autoComplete="email"
                      spellCheck={false}
                      inputMode="email"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 16px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Mật khẩu (ít nhất 6 ký tự)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      autoComplete="new-password"
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 16px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Nhập lại mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      style={{
                        width: '100%',
                        height: '48px',
                        borderRadius: '16px',
                        border: '1px solid #CBD5E1',
                        padding: '0 16px 0 42px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div
                  onClick={() => setAgreedTerms(!agreedTerms)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                >
                  {agreedTerms ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
                  <span style={{ fontSize: '12px', color: '#475569' }}>
                    Tôi đồng ý với Điều khoản sử dụng & Bảo mật dữ liệu UniPath
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="L"
                  fullWidth
                  loading={loading}
                >
                  Tạo tài khoản mới →
                </Button>
              </form>
            )}

            {/* Role Selection & Explicit Demo Sandbox Switch */}
            <div style={{ margin: '18px 0 4px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  backgroundColor: isDemoMode ? '#FFFBEB' : '#F8FAFC',
                  border: isDemoMode ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', textAlign: 'left' }}>
                  <FlaskConical size={15} color={isDemoMode ? '#D97706' : '#64748B'} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                      Chế độ Kiểm thử Hội đồng (Demo Sandbox)
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                      {isDemoMode
                        ? 'Đang bật: Bấm vai trò để vào thẳng Sandbox'
                        : 'Mặc định tắt: Bấm vai trò sẽ điền Email & yêu cầu Mật khẩu'}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDemoMode}
                  onChange={toggleDemoMode}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#D97706' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  type="button"
                  variant="tonal"
                  size="M"
                  fullWidth
                  onClick={() => selectAccountForAuth('quy@unipath.vn', 'student')}
                  style={{
                    backgroundColor: '#FFFBEB',
                    color: '#B45309',
                    border: '1px solid #FDE68A',
                  }}
                >
                  {isDemoMode
                    ? '🧪 [DEMO] Vào thẳng Thí sinh: Trần Công Quý'
                    : '🎓 Điền Email Thí sinh mẫu (quy@unipath.vn)'}
                </Button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <Button
                    type="button"
                    variant="tonal"
                    size="S"
                    onClick={() => selectAccountForAuth('admin@unipath.vn', 'admin')}
                    style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                  >
                    {isDemoMode ? '🧪 [DEMO] Admin' : '🔒 Cổng Admin'}
                  </Button>

                  <Button
                    type="button"
                    variant="tonal"
                    size="S"
                    onClick={() => selectAccountForAuth('tuyensinh@pxu.edu.vn', 'pxu')}
                    style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}
                  >
                    {isDemoMode ? '🧪 [DEMO] PXU' : '🔒 Cổng ĐH Phú Xuân'}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="S"
                  fullWidth
                  onClick={loginAsGuest}
                >
                  Tiếp tục khám phá với tư cách Khách
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
