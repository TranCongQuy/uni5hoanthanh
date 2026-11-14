import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, FileText, ArrowRight, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';
import {
  MAX_ACTIVE_APPLICATIONS,
  getMajorCutoffForApp,
  validateNewApplicationSubmission,
} from '../../services/ApplicationWorkflow';
import { isTerminalStatus } from '../../types';
import {
  formatCleanDecimal,
  validateStudentScore,
  validateVietnamPhone,
} from '../../utils/validation';

const ADMISSION_METHODS = [
  'Xét điểm thi tốt nghiệp THPT năm 2026',
  'Xét học bạ THPT (5 học kỳ)',
  'Xét điểm thi Đánh giá năng lực ĐHQG',
];

export const ApplyDemoModal: React.FC = () => {
  const {
    isApplyDemoOpen,
    closeApplyDemo,
    applyDemoTargetUni,
    user,
    isLoggedIn,
    isGuest,
    profile,
    myApplications,
    addApplication,
    setActiveTab,
    closeUniDetail,
    openAuthModal,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [admissionMethod, setAdmissionMethod] = useState<string>(ADMISSION_METHODS[0]);
  const [candidateName, setCandidateName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [scoreText, setScoreText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [createdCode, setCreatedCode] = useState<string>('');

  // Complete state reset whenever modal opens/closes or target university changes (fixes B.6)
  useEffect(() => {
    setStep(1);
    setSelectedMajor(applyDemoTargetUni?.majors[0] || '');
    setAdmissionMethod(ADMISSION_METHODS[0]);
    setCandidateName(profile.name || user.name || '');
    setPhone(profile.phone || '');
    setScoreText(
      profile.expectedScore > 0 ? formatCleanDecimal(profile.expectedScore, 2) : ''
    );
    setErrorMsg('');
    setCreatedCode('');
  }, [isApplyDemoOpen, applyDemoTargetUni, profile.name, profile.phone, profile.expectedScore, user.name]);

  if (!isApplyDemoOpen || !applyDemoTargetUni) return null;

  // Ensure selectedMajor always belongs to the current university (never leaks from previous uni)
  const currentMajor = applyDemoTargetUni.majors.includes(selectedMajor)
    ? selectedMajor
    : applyDemoTargetUni.majors[0] || '';

  const activeWishCount = myApplications.filter((a) => !isTerminalStatus(a.status)).length;
  const precheck = validateNewApplicationSubmission(
    myApplications,
    user.email,
    applyDemoTargetUni.id,
    currentMajor
  );
  const majorCutoff = getMajorCutoffForApp(applyDemoTargetUni, currentMajor);

  const handleNext = () => {
    setErrorMsg('');

    if (!isLoggedIn || isGuest || user.role !== 'student') {
      closeApplyDemo();
      openAuthModal();
      return;
    }

    if (step === 1) {
      if (!currentMajor) {
        setErrorMsg('Vui lòng chọn ngành đăng ký xét tuyển.');
        return;
      }
      if (!precheck.ok) {
        setErrorMsg(precheck.error || 'Không thể tiếp tục với ngành này.');
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (candidateName.trim().length < 2) {
        setErrorMsg('Vui lòng nhập họ và tên thí sinh hợp lệ (tối thiểu 2 ký tự).');
        return;
      }
      const phoneCheck = validateVietnamPhone(phone);
      if (!phoneCheck.ok) {
        setErrorMsg(phoneCheck.error || 'Số điện thoại không hợp lệ.');
        return;
      }
      const scoreCheck = validateStudentScore(scoreText);
      if (!scoreCheck.ok || scoreCheck.value === undefined) {
        setErrorMsg(scoreCheck.error || 'Điểm xét tuyển không hợp lệ.');
        return;
      }
      if (!precheck.ok) {
        setErrorMsg(precheck.error || 'Không thể nộp trùng nguyện vọng.');
        return;
      }

      const created = addApplication({
        uniId: applyDemoTargetUni.id,
        uniName: applyDemoTargetUni.name,
        uniCode: applyDemoTargetUni.code,
        major: currentMajor,
        candidateName: candidateName.trim(),
        phone: phone.trim(),
        email: user.email,
        score: scoreCheck.value,
        notes: `Phương thức: ${admissionMethod}. Đăng ký xét tuyển trực tuyến qua UniPath.`,
      });

      if (created) {
        setCreatedCode(created.code);
        setStep(3);
      }
      return;
    }

    closeApplyDemo();
    setStep(1);
  };

  const handleGoToProfile = () => {
    closeApplyDemo();
    closeUniDetail();
    setActiveTab(4);
    setStep(1);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
      }}
      onClick={closeApplyDemo}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '660px' : '520px',
          height: isDesktop ? 'min(86vh, 760px)' : 'auto',
          maxHeight: isDesktop ? '86vh' : 'min(88dvh, calc(100dvh - 56px))',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '24px' : '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop ? '0 25px 60px rgba(0,0,0,0.35)' : '0 -10px 30px rgba(0,0,0,0.25)',
          animation: isDesktop ? 'fadeIn 0.25s ease-out' : 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                Nộp hồ sơ xét tuyển — Bước {step}/3
              </h3>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: activeWishCount >= MAX_ACTIVE_APPLICATIONS ? '#FEF2F2' : '#EFF6FF',
                  color: activeWishCount >= MAX_ACTIVE_APPLICATIONS ? '#DC2626' : '#1D4ED8',
                  border: `1px solid ${activeWishCount >= MAX_ACTIVE_APPLICATIONS ? '#FECACA' : '#BFDBFE'}`,
                }}
              >
                Nguyện vọng: {activeWishCount}/{MAX_ACTIVE_APPLICATIONS}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
              {applyDemoTargetUni.name} ({applyDemoTargetUni.code})
            </span>
          </div>

          <button
            type="button"
            onClick={closeApplyDemo}
            aria-label="Đóng hộp thoại nộp hồ sơ"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 104px' }}>
          {(errorMsg || (step < 3 && !precheck.ok)) && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#B91C1C',
                borderRadius: '14px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontWeight: 700,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{errorMsg || precheck.error}</span>
            </div>
          )}

          {step === 1 && (
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                1. Chọn ngành học đăng ký tại {applyDemoTargetUni.code}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {applyDemoTargetUni.majors.map((m) => {
                  const active = currentMajor === m;
                  const mCutoff = getMajorCutoffForApp(applyDemoTargetUni, m);
                  const alreadyApplied = myApplications.some(
                    (a) =>
                      !isTerminalStatus(a.status) &&
                      a.uniId === applyDemoTargetUni.id &&
                      a.major.trim().toLowerCase() === m.trim().toLowerCase()
                  );
                  return (
                    <div
                      key={m}
                      onClick={() => {
                        setSelectedMajor(m);
                        setErrorMsg('');
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        border: active ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: active ? 700 : 600,
                            color: active ? '#2563EB' : '#1E293B',
                          }}
                        >
                          {m}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                          Điểm chuẩn ngành: <strong>{formatCleanDecimal(mCutoff, 2)}đ</strong>
                          {alreadyApplied && (
                            <span style={{ color: '#DC2626', fontWeight: 700, marginLeft: '8px' }}>
                              · Đã nộp nguyện vọng này
                            </span>
                          )}
                        </div>
                      </div>
                      {active && <CheckCircle2 size={18} color="#2563EB" style={{ flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>

              <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                Phương thức xét tuyển ưu tiên:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {ADMISSION_METHODS.map((item) => {
                  const active = admissionMethod === item;
                  return (
                    <div
                      key={item}
                      onClick={() => setAdmissionMethod(item)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: active ? '2px solid #10B981' : '1px solid #E2E8F0',
                        backgroundColor: active ? '#ECFDF5' : '#FFFFFF',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: active ? 700 : 500,
                        color: active ? '#059669' : '#334155',
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                  2. Xác nhận & kiểm tra thông tin hồ sơ
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setStep(1);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#2563EB',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ← Đổi ngành
                </button>
              </div>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Họ và tên thí sinh *
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    autoComplete="name"
                    onChange={(e) => {
                      setCandidateName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Nhập họ và tên trên CCCD..."
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      padding: '0 12px',
                      fontSize: '13.5px',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      autoComplete="tel"
                      inputMode="tel"
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="VD: 0912345678"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        padding: '0 12px',
                        fontSize: '13.5px',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Điểm xét tuyển (thang 30) *
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={scoreText}
                      onChange={(e) => {
                        setScoreText(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="VD: 24.5"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '12px',
                        border: '1.5px solid #CBD5E1',
                        padding: '0 12px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: '#1D4ED8',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: '#475569' }}>
                  <strong>Email định danh tài khoản:</strong> {user.email}
                </div>
                {profile.school && (
                  <div style={{ fontSize: '12.5px', color: '#475569' }}>
                    <strong>Trường THPT:</strong> {profile.school} {profile.province ? `(${profile.province})` : ''}
                  </div>
                )}

                <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '2px 0' }} />

                <div>
                  <strong>Trường xét tuyển:</strong> {applyDemoTargetUni.name} ({applyDemoTargetUni.code})
                </div>
                <div>
                  <strong>Ngành đăng ký:</strong>{' '}
                  <span style={{ color: '#2563EB', fontWeight: 800 }}>{currentMajor}</span>{' '}
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    (Điểm chuẩn ngành: {formatCleanDecimal(majorCutoff, 2)}đ)
                  </span>
                </div>
                <div>
                  <strong>Phương thức:</strong> {admissionMethod}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 10px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 800, color: '#0F172A' }}>
                Hồ sơ {createdCode ? `(${createdCode})` : ''} đã nộp thành công!
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Hồ sơ ngành <strong>{currentMajor}</strong> của bạn đã được ghi nhận vào hệ thống tuyển sinh của{' '}
                <strong>{applyDemoTargetUni.name}</strong> và đồng bộ trong mục Cá nhân.
              </p>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  borderRadius: '16px',
                  padding: '14px',
                  border: '1px solid #BFDBFE',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1D4ED8',
                  fontSize: '13px',
                  fontWeight: 700,
                  marginBottom: '20px',
                }}
              >
                <FileText size={18} />
                <span>Trạng thái: Đang xét duyệt hồ sơ đợt 1</span>
              </div>

              <Button
                variant="tonal"
                size="L"
                fullWidth
                icon={<ArrowRight size={16} />}
                onClick={handleGoToProfile}
              >
                Xem hồ sơ trong trang Cá nhân →
              </Button>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {step < 3 ? (
            <Button
              variant="primary"
              size="L"
              fullWidth
              disabled={!precheck.ok}
              onClick={handleNext}
            >
              {step === 1 ? 'Tiếp tục bước 2 →' : 'Xác nhận nộp hồ sơ →'}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="M"
              fullWidth
              onClick={() => {
                closeApplyDemo();
                setStep(1);
              }}
            >
              Đóng cửa sổ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
