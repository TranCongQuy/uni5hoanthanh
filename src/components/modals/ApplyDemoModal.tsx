import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const ApplyDemoModal: React.FC = () => {
  const { isApplyDemoOpen, closeApplyDemo, applyDemoTargetUni, profile, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [admissionMethod, setAdmissionMethod] = useState<string>('Xét điểm thi tốt nghiệp THPT');
  const [demoCode] = useState(() => Math.floor(1000 + Math.random() * 9000));

  if (!isApplyDemoOpen || !applyDemoTargetUni) return null;

  const currentMajor = selectedMajor || applyDemoTargetUni.majors[0];

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) {
      setStep(3);
      showToast('Nộp hồ sơ xét tuyển thử nghiệm thành công!');
    } else {
      closeApplyDemo();
      setStep(1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={closeApplyDemo}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '88vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
              Nộp hồ sơ xét tuyển — Bước {step}/3
            </h3>
            <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
              (Chế độ trải nghiệm: Chưa gửi hồ sơ thật đến trường)
            </span>
          </div>

          <button
            onClick={closeApplyDemo}
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
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 90px' }}>
          {step === 1 && (
            <div>
              <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                1. Chọn ngành học đăng ký tại {applyDemoTargetUni.code}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {applyDemoTargetUni.majors.map((m) => {
                  const active = currentMajor === m;
                  return (
                    <div
                      key={m}
                      onClick={() => setSelectedMajor(m)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '16px',
                        border: active ? '2px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? '#2563EB' : '#1E293B' }}>
                        {m}
                      </span>
                      {active && <CheckCircle2 size={18} color="#2563EB" />}
                    </div>
                  );
                })}
              </div>

              <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                Phương thức xét tuyển ưu tiên:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Xét điểm thi tốt nghiệp THPT năm 2026',
                  'Xét học bạ THPT (5 học kỳ)',
                  'Xét điểm thi Đánh giá năng lực ĐHQG',
                ].map((item) => {
                  const active = admissionMethod === item;
                  return (
                    <div
                      key={item}
                      onClick={() => setAdmissionMethod(item)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: active ? '1.5px solid #10B981' : '1px solid #E2E8F0',
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
              <h4 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>
                2. Xác nhận thông tin hồ sơ thí sinh
              </h4>

              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                <div><strong>Họ và tên:</strong> {profile.name}</div>
                <div><strong>Số điện thoại:</strong> {profile.phone}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Trường THPT:</strong> {profile.school} ({profile.province})</div>
                <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
                <div><strong>Trường xét tuyển:</strong> {applyDemoTargetUni.name} ({applyDemoTargetUni.code})</div>
                <div><strong>Ngành đăng ký:</strong> <span style={{ color: '#2563EB', fontWeight: 700 }}>{currentMajor}</span></div>
                <div><strong>Phương thức:</strong> {admissionMethod}</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Hồ sơ đã được tiếp nhận mô phỏng!
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B', lineHeight: 1.45 }}>
                Mã hồ sơ: <strong>UNIPATH-2026-{demoCode}</strong>.
                Trong đợt tuyển sinh chính thức, hồ sơ sẽ được đồng bộ trực tiếp tới cổng thông tin tuyển sinh của {applyDemoTargetUni.code}.
              </p>
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
          <Button
            variant="primary"
            size="L"
            fullWidth
            onClick={handleNext}
          >
            {step === 1 ? 'Tiếp tục bước 2 →' : step === 2 ? 'Xác nhận nộp hồ sơ →' : 'Hoàn tất & Đóng'}
          </Button>
        </div>
      </div>
    </div>
  );
};
