import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, Mail, User, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    register,
    loginDemo,
    loginAsGuest,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Email hoặc mật khẩu không chính xác. Bạn có thể dùng tài khoản demo bên dưới!');
      }
    }, 600);
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
      const success = register(fullName, email, password);
      if (!success) {
        setErrorMsg('Email này đã tồn tại trong hệ thống!');
      }
    }, 600);
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
          maxWidth: '440px',
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
          onClick={closeAuthModal}
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
          {/* Hero Banner Header 160dp */}
          <div
            style={{
              height: '160px',
              background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #06B6D4 100%)',
              padding: '24px 20px',
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
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px' }}>
                UNIPATH
              </span>
            </div>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>
              Cùng bạn kiến tạo tương lai nghề nghiệp
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
                marginBottom: '20px',
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

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  color: '#EF4444',
                  fontSize: '13px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="minh@unipath.vn"
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
                    <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Mật khẩu
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
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
                  style={{ marginTop: '6px' }}
                >
                  Đăng nhập ngay →
                </Button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Họ và tên
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn Minh"
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
                    <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
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
                    Tôi đồng ý với Điều khoản sử dụng Unipath
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

            {/* Demo & Guest Fast Buttons */}
            <div style={{ margin: '20px 0 10px', textAlign: 'center' }}>
              <div style={{ position: 'relative', textAlign: 'center', marginBottom: '14px' }}>
                <div style={{ height: '1px', backgroundColor: '#E2E8F0', position: 'absolute', top: '50%', left: 0, right: 0 }} />
                <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 12px', fontSize: '12px', color: '#94A3B8' }}>
                  hoặc trải nghiệm nhanh
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  variant="tonal"
                  size="M"
                  fullWidth
                  onClick={loginDemo}
                >
                  Dùng tài khoản demo (minh@unipath.vn)
                </Button>

                <Button
                  variant="ghost"
                  size="M"
                  fullWidth
                  onClick={loginAsGuest}
                >
                  Tiếp tục với tư cách Khách
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
