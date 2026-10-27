import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, CheckSquare, Square, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const AuthScreen: React.FC = () => {
  const { login, register, loginDemo } = useApp();

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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const success = login(email, password);
      if (!success) {
        setErrorMsg('Email hoặc mật khẩu không chính xác. Bạn có thể nhấn nút Tiếp tục với tài khoản thử nghiệm Trần Công Quý ở bên dưới!');
      }
    }, 500);
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
      setErrorMsg('Vui lòng tích chọn đồng ý với Điều khoản sử dụng Unipath!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const success = register(fullName, email, password);
      if (!success) {
        setErrorMsg('Email này đã tồn tại trong hệ thống. Vui lòng chọn email khác hoặc đăng nhập!');
      }
    }, 500);
  };

  const fillDemoCredentials = () => {
    setEmail('quy@unipath.vn');
    setPassword('123456');
    setMode('login');
    setErrorMsg('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 40%, #F8FAFC 100%)',
        padding: 'max(24px, env(safe-area-inset-top, 24px)) 16px max(32px, env(safe-area-inset-bottom, 32px))',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '32px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 16px 40px rgba(37,99,235,0.08), 0 4px 12px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* 1. Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #0284C7 100%)',
            padding: '28px 24px 22px',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              marginBottom: '12px',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <img
              src="/images/logo_unipath.png"
              alt="Unipath Logo"
              style={{ width: '24px', height: '24px', borderRadius: '6px', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>
              UNIPATH VIỆT NAM
            </span>
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Cổng Thông Tin Tuyển Sinh
          </h1>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.9, lineHeight: 1.4 }}>
            Đăng nhập để đối soát điểm chuẩn và nhận tư vấn định hướng cùng AI
          </p>
        </div>

        {/* 2. Body Container */}
        <div style={{ padding: '24px 20px 28px' }}>
          {/* Segmented Switcher (Đăng nhập | Tạo tài khoản) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#F1F5F9',
              borderRadius: '16px',
              padding: '4px',
              marginBottom: '22px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              style={{
                height: '42px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: mode === 'login' ? '#FFFFFF' : 'transparent',
                color: mode === 'login' ? '#2563EB' : '#64748B',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
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
                height: '42px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
                color: mode === 'register' ? '#2563EB' : '#64748B',
                fontWeight: 800,
                fontSize: '14px',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Tạo tài khoản
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FEE2E2',
                color: '#EF4444',
                fontSize: '13px',
                padding: '12px 14px',
                borderRadius: '14px',
                marginBottom: '18px',
                lineHeight: 1.45,
                fontWeight: 600,
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* FORM: ĐĂNG NHẬP */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Email tài khoản Unipath
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="quy@unipath.vn"
                    required
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      border: '1.5px solid #CBD5E1',
                      padding: '0 16px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: '#2563EB',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Điền mẫu demo
                  </button>
                </div>
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
                      border: '1.5px solid #CBD5E1',
                      padding: '0 42px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
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
                Đăng nhập ngay →
              </Button>
            </form>
          ) : (
            /* FORM: TẠO TÀI KHOẢN */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Họ và tên thí sinh
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Trần Công Quý"
                    required
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      border: '1.5px solid #CBD5E1',
                      padding: '0 16px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Email đăng ký
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hocsinh@unipath.vn"
                    required
                    style={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      border: '1.5px solid #CBD5E1',
                      padding: '0 16px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <Mail size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Mật khẩu (tối thiểu 6 ký tự)
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
                      border: '1.5px solid #CBD5E1',
                      padding: '0 16px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
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
                      border: '1.5px solid #CBD5E1',
                      padding: '0 16px 0 42px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                  <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                </div>
              </div>

              <div
                onClick={() => setAgreedTerms(!agreedTerms)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', marginTop: '2px' }}
              >
                {agreedTerms ? <CheckSquare size={18} color="#2563EB" /> : <Square size={18} color="#94A3B8" />}
                <span style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  Tôi đồng ý với Điều khoản sử dụng & Quy chế bảo mật Unipath
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="L"
                fullWidth
                loading={loading}
                style={{ marginTop: '4px' }}
              >
                Tạo tài khoản Unipath →
              </Button>
            </form>
          )}

          {/* 3. Divider: HOẶC TRẢI NGHIỆM TÀI KHOẢN THỬ NGHIỆM */}
          <div style={{ margin: '24px 0 16px', position: 'relative', textAlign: 'center' }}>
            <div style={{ height: '1px', backgroundColor: '#E2E8F0', position: 'absolute', top: '50%', left: 0, right: 0 }} />
            <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 14px', fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>
              HOẶC TRẢI NGHIỆM NHANH
            </span>
          </div>

          {/* 4. MỤC: TIẾP TỤC VỚI TÀI KHOẢN THỬ NGHIỆM TRẦN CÔNG QUÝ */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)',
              border: '2px solid #F59E0B',
              borderRadius: '22px',
              padding: '16px',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top VIP Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  color: '#92400E',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  border: '1px solid #FCD34D',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={13} color="#D97706" />
                TÀI KHOẢN THỬ NGHIỆM MẪU
              </span>

              <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 700 }}>
                1-Click vào app
              </span>
            </div>

            {/* Candidate Info Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #F59E0B',
                  flexShrink: 0,
                  backgroundColor: '#FFFFFF',
                }}
              >
                <img
                  src="/images/avatar_user.png"
                  alt="Trần Công Quý"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350F' }}>
                  Trần Công Quý
                </div>
                <div style={{ fontSize: '12px', color: '#92400E', marginTop: '2px' }}>
                  Email: <strong>quy@unipath.vn</strong> • MK: <strong>123456</strong>
                </div>
              </div>
            </div>

            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#78350F', lineHeight: 1.4 }}>
              Đầy đủ dữ liệu mẫu: Điểm thi 24.5đ, hồ sơ xét tuyển ĐH Phú Xuân & Bách Khoa, kết quả RIASEC.
            </p>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={loginDemo}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                transition: 'all 0.2s',
              }}
            >
              <span>Tiếp tục với tài khoản thử nghiệm Trần Công Quý</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Privacy & Trust footer note */}
          <div style={{ marginTop: '18px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Hệ thống bảo mật dữ liệu học sinh chuẩn Unipath Việt Nam</span>
          </div>
        </div>
      </div>
    </div>
  );
};
