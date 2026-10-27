import React from 'react';
import { X, CheckCircle2, Clock, AlertCircle, User, Phone, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, UniversityAvatar } from '../common/UI';

export const ViewApplicationModal: React.FC = () => {
  const { selectedAppForDetail, closeApplicationDetail } = useApp();

  if (!selectedAppForDetail) return null;

  const app = selectedAppForDetail;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={closeApplicationDetail}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#E2E8F0',
            }}
          />
        </div>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Chi tiết hồ sơ xét tuyển
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Mã hồ sơ: <strong style={{ color: '#2563EB' }}>{app.code}</strong>
            </span>
          </div>

          <button
            onClick={closeApplicationDetail}
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 96px' }}>
          {/* Status Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '16px',
              border: '1.5px solid #E2E8F0',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                Trạng thái hiện tại:
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: app.statusColor,
                  backgroundColor: app.statusColor === '#10B981' ? '#ECFDF5' : '#FFFBEB',
                  border: `1px solid ${app.statusColor}`,
                  padding: '4px 12px',
                  borderRadius: '12px',
                }}
              >
                {app.status}
              </span>
            </div>

            {/* Timeline Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    1. Đã tiếp nhận hồ sơ trực tuyến
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Thời gian: {app.submittedAt}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={18} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    2. Đối soát dữ liệu điểm thi & học bạ THPT
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Ban tuyển sinh trường {app.uniCode} đang thẩm định hồ sơ.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: 0.5 }}>
                <AlertCircle size={18} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                    3. Công bố danh sách trúng tuyển chính thức
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Dự kiến gửi thông báo qua SMS và Email.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School & Major Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <UniversityAvatar code={app.uniCode} size={44} />
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  {app.uniName}
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Mã trường: {app.uniCode}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Ngành đăng ký:</span>
                <span style={{ fontWeight: 700, color: '#2563EB' }}>{app.major}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Điểm xét tuyển:</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{app.score} điểm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Ngày giờ nộp:</span>
                <span style={{ fontWeight: 600, color: '#334155' }}>{app.submittedAt}</span>
              </div>
            </div>
          </div>

          {/* Candidate Info Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <h5 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
              Thông tin thí sinh đăng ký
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                <User size={15} color="#64748B" />
                <span>Họ và tên: <strong>{app.candidateName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                <Phone size={15} color="#64748B" />
                <span>Số điện thoại: <strong>{app.phone}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                <Mail size={15} color="#64748B" />
                <span>Email: <strong>{app.email}</strong></span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {app.notes && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '16px',
                padding: '14px',
                border: '1px solid #BFDBFE',
                fontSize: '12px',
                color: '#1E40AF',
                lineHeight: 1.45,
              }}
            >
              <strong>Ghi chú từ tuyển sinh:</strong> {app.notes}
            </div>
          )}
        </div>

        {/* Footer */}
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
            variant="tonal"
            size="L"
            fullWidth
            onClick={closeApplicationDetail}
          >
            Đóng chi tiết hồ sơ
          </Button>
        </div>
      </div>
    </div>
  );
};
