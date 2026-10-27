import React, { useState } from 'react';
import { X, CheckCircle2, Clock, AlertCircle, User, Phone, Mail, Ban, XCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button, UniversityAvatar } from '../common/UI';

export const ViewApplicationModal: React.FC = () => {
  const { selectedAppForDetail, closeApplicationDetail, cancelApplication } = useApp();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!selectedAppForDetail) return null;

  const app = selectedAppForDetail;

  const handleConfirmCancel = () => {
    cancelApplication(app.id);
    setShowCancelConfirm(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
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
          height: 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: 'calc(100dvh - 56px)',
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
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px', paddingBottom: '4px', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              width: '40px',
              height: '4px',
              borderRadius: '2px',
              backgroundColor: '#CBD5E1',
            }}
          />
        </div>

        {/* Sticky Top Header: 100% visible on real mobile phones */}
        <div
          style={{
            padding: '8px 18px 12px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 60,
            backgroundColor: '#FFFFFF',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                Chi tiết hồ sơ xét tuyển
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
              Mã hồ sơ: <strong style={{ color: '#2563EB' }}>{app.code}</strong>
            </span>
          </div>

          <button
            onClick={closeApplicationDetail}
            aria-label="Đóng chi tiết hồ sơ"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1E293B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 100px' }}>
          {/* Status Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '16px',
              border: '1.5px solid #E2E8F0',
              marginBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                Trạng thái hồ sơ:
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: app.statusColor,
                  backgroundColor:
                    app.status === 'Hồ sơ hợp lệ' ? '#ECFDF5'
                    : app.status === 'Đang xét duyệt' ? '#FFFBEB'
                    : app.status === 'Thiếu hồ sơ' ? '#EFF6FF'
                    : app.status === 'Đã bị hủy' ? '#FEF2F2'
                    : '#F1F5F9',
                  border: `1.5px solid ${app.statusColor}`,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {app.status === 'Hồ sơ hợp lệ' && <CheckCircle2 size={14} />}
                {app.status === 'Đang xét duyệt' && <Clock size={14} />}
                {app.status === 'Thiếu hồ sơ' && <AlertCircle size={14} />}
                {app.status === 'Đã hủy' && <Ban size={14} />}
                {app.status === 'Đã bị hủy' && <XCircle size={14} />}
                <span>{app.status}</span>
              </span>
            </div>

            {/* Cancel banner if cancelled */}
            {app.status === 'Đã hủy' && (
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#475569',
                  marginBottom: '12px',
                }}
              >
                <strong>Hồ sơ đã được bạn chủ động hủy</strong> vào lúc {app.submittedAt}. Hồ sơ không còn hiệu lực xét tuyển.
              </div>
            )}

            {app.status === 'Đã bị hủy' && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#B91C1C',
                  marginBottom: '12px',
                }}
              >
                <strong>Hồ sơ đã bị nhà trường từ chối/hủy:</strong> Không đáp ứng ngưỡng đảm bảo chất lượng đầu vào của ngành học.
              </div>
            )}

            {/* Timeline Progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
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
                <Clock
                  size={18}
                  color={app.status === 'Đang xét duyệt' ? '#F59E0B' : app.status === 'Hồ sơ hợp lệ' ? '#10B981' : '#94A3B8'}
                  style={{ marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    2. Đối soát dữ liệu điểm thi & học bạ THPT
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    {app.status === 'Thiếu hồ sơ'
                      ? 'Yêu cầu thí sinh bổ sung tài liệu học bạ để hoàn tất thẩm định.'
                      : app.status === 'Đang xét duyệt'
                      ? `Ban tuyển sinh ${app.uniCode} đang thẩm định hồ sơ của bạn.`
                      : 'Đã hoàn tất kiểm tra tính xác thực của hồ sơ.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', opacity: app.status === 'Hồ sơ hợp lệ' ? 1 : 0.6 }}>
                {app.status === 'Hồ sơ hợp lệ' ? (
                  <CheckCircle2 size={18} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={18} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    3. Kết quả xét tuyển chính thức
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    {app.status === 'Hồ sơ hợp lệ'
                      ? 'Hồ sơ đạt tiêu chuẩn. Đang chờ danh sách trúng tuyển đợt 1.'
                      : 'Dự kiến thông báo qua SMS và cổng thông tin Unipath.'}
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
                marginBottom: '16px',
              }}
            >
              <strong>Ghi chú từ tuyển sinh:</strong> {app.notes}
            </div>
          )}

          {/* HỦY HỒ SƠ XÉT TUYỂN KHI ĐANG XÉT DUYỆT */}
          {app.status === 'Đang xét duyệt' && (
            <div style={{ marginTop: '10px' }}>
              {!showCancelConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '14px',
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Ban size={16} />
                  <span>Hủy hồ sơ xét tuyển này</span>
                </button>
              ) : (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #EF4444',
                    borderRadius: '16px',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#B91C1C', fontWeight: 800, fontSize: '14px', marginBottom: '6px' }}>
                    <AlertTriangle size={18} />
                    <span>Xác nhận hủy hồ sơ xét tuyển?</span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#7F1D1D', lineHeight: 1.4 }}>
                    Hồ sơ đăng ký vào {app.uniName} sẽ bị hủy ngay lập tức và không thể phục hồi.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(false)}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#64748B',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Giữ lại hồ sơ
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmCancel}
                      style={{
                        flex: 1,
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#DC2626',
                        border: 'none',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Đồng ý Hủy
                    </button>
                  </div>
                </div>
              )}
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
