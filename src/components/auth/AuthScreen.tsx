import React, { useState, useRef } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  School,
  FlaskConical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const AuthScreen: React.FC = () => {
  const { login, register, loginAsGuest, isDemoMode, toggleDemoMode, demoQuickSwitch } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
      setErrorMsg('Vui lòng tích chọn đồng ý với Điều khoản sử dụng UniPath!');
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

  const handleRoleCardAction = (targetEmail: string, demoTarget: 'student' | 'admin' | 'pxu') => {
    if (isDemoMode) {
      demoQuickSwitch(demoTarget);
      return;
    }
    setMode('login');
    setEmail(targetEmail);
    setPassword('');
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => passwordInputRef.current?.focus(), 120);
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
            Đăng nhập xác thực để đối soát điểm chuẩn và quản lý nguyện vọng xét tuyển
          </p>
        </div>

        {/* 2. Body Container */}
        <div style={{ padding: '24px 20px 28px' }}>
          {/* Segmented Switcher */}
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

          {errorMsg && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FECACA',
                color: '#DC2626',
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

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                  Email tài khoản UniPath
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nhap-email@unipath.vn"
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
                    Mật khẩu xác thực
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
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
                Đăng nhập xác thực →
              </Button>
            </form>
          ) : (
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
                    placeholder="Nhập họ và tên..."
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
                  Email cá nhân
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hocsinh@example.com"
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
                  Tôi đồng ý với Điều khoản sử dụng & Quy chế bảo mật UniPath
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
                Tạo tài khoản UniPath →
              </Button>
            </form>
          )}

          {/* Guest Exploration CTA */}
          <div style={{ marginTop: '12px' }}>
            <Button type="button" variant="ghost" size="S" fullWidth onClick={loginAsGuest}>
              Tiếp tục khám phá ở chế độ Khách →
            </Button>
          </div>

          {/* 3. Role Portals + Explicit Demo Mode Switch */}
          <div style={{ margin: '18px 0 12px', position: 'relative', textAlign: 'center' }}>
            <div style={{ height: '1px', backgroundColor: '#E2E8F0', position: 'absolute', top: '50%', left: 0, right: 0 }} />
            <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 12px', fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
              CỔNG PHÂN QUYỀN HỆ THỐNG
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '10px 12px',
              borderRadius: '14px',
              backgroundColor: isDemoMode ? '#FFFBEB' : '#F8FAFC',
              border: isDemoMode ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={16} color={isDemoMode ? '#D97706' : '#64748B'} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                  Chế độ Kiểm thử Hội đồng (Demo Sandbox)
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {isDemoMode
                    ? 'Đang bật: Cho phép vào thẳng vai trò Sandbox'
                    : 'Đang tắt: Mọi vai trò đều bắt buộc nhập mật khẩu'}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 1. Candidate Role */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1.5px solid #F59E0B',
                borderRadius: '16px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#92400E', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '8px', border: '1px solid #FCD34D', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="#D97706" />
                  CỔNG THÍ SINH
                </span>
                <span style={{ fontSize: '11px', color: '#B45309', fontWeight: 700 }}>quy@unipath.vn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#78350F' }}>Trần Công Quý (2k8)</div>
                  <div style={{ fontSize: '11.5px', color: '#92400E' }}>Khảo sát Holland, AI Matching, Nộp hồ sơ</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleCardAction('quy@unipath.vn', 'student')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isDemoMode ? '🧪 Vào Sandbox' : '🔒 Chọn Email'}
                </button>
              </div>
            </div>

            {/* 2. System Admin Role */}
            <div
              style={{
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
                border: '1.5px solid #3B82F6',
                borderRadius: '16px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#1E40AF', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '8px', border: '1px solid #BFDBFE', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldAlert size={12} color="#2563EB" />
                  ADMIN TOÀN QUỐC
                </span>
                <span style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700 }}>admin@unipath.vn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>Admin Hệ Thống UniPath</div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>Quản trị 30 trường ĐH & thẩm định hồ sơ</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleCardAction('admin@unipath.vn', 'admin')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isDemoMode ? '🧪 Vào Sandbox' : '🔒 Chọn Email'}
                </button>
              </div>
            </div>

            {/* 3. University Representative */}
            <div
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                border: '1.5px solid #10B981',
                borderRadius: '16px',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#065F46', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '8px', border: '1px solid #A7F3D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <School size={12} color="#059669" />
                  ĐẠI HỌC PHÚ XUÂN (PXU)
                </span>
                <span style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>tuyensinh@pxu.edu.vn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#064E3B' }}>Ban Tuyển sinh ĐH Phú Xuân</div>
                  <div style={{ fontSize: '11.5px', color: '#047857' }}>Cô lập dữ liệu xét duyệt riêng của PXU</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleCardAction('tuyensinh@pxu.edu.vn', 'pxu')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isDemoMode ? '🧪 Vào Sandbox' : '🔒 Chọn Email'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '18px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8' }}>
            <ShieldCheck size={14} color="#10B981" />
            <span>Mật khẩu được băm SHA-256 có muối (Salted Hash) an toàn</span>
          </div>
        </div>
      </div>
    </div>
  );
};
