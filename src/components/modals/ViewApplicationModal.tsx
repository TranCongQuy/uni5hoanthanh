import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Phone,
  Mail,
  Ban,
  XCircle,
  AlertTriangle,
  Award,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStatusMeta } from '../../types';
import { Button, UniversityAvatar } from '../common/UI';

const SUPPLEMENT_PRESETS = [
  'Đã bổ sung bản scan Học bạ THPT 5 học kỳ có dấu mộc đỏ',
  'Đã cập nhật ảnh chụp CCCD 2 mặt & Chứng chỉ ngoại ngữ quốc tế',
  'Đã đính kèm Minh chứng giải thưởng & Hồ sơ xét học bổng OJT',
];

export const ViewApplicationModal: React.FC = () => {
  const {
    selectedAppForDetail,
    closeApplicationDetail,
    cancelApplication,
    resubmitApplicationSupplement,
    updateApplicationStatus,
    isLoggedIn,
    isGuest,
    user,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [supplementText, setSupplementText] = useState('');
  const [reviewerNote, setReviewerNote] = useState('');

  useEffect(() => {
    setShowCancelConfirm(false);
    setSupplementText('');
    setReviewerNote('');
  }, [selectedAppForDetail?.id, selectedAppForDetail?.status]);

  if (!selectedAppForDetail) return null;

  const app = selectedAppForDetail;
  const meta = getStatusMeta(app.status);

  const isStudentOwner =
    isLoggedIn &&
    !isGuest &&
    user.role === 'student' &&
    app.email.trim().toLowerCase() === user.email.trim().toLowerCase();

  const canInstitutionalReview =
    isLoggedIn &&
    (user.role === 'admin' || (user.role === 'university_pxu' && app.uniCode === 'PXU'));

  const handleConfirmCancel = () => {
    cancelApplication(app.id);
    setShowCancelConfirm(false);
  };

  const handleSupplementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resubmitApplicationSupplement(
      app.id,
      supplementText.trim() || SUPPLEMENT_PRESETS[0]
    );
    setSupplementText('');
  };

  const renderStatusIcon = () => {
    switch (app.status) {
      case 'Đã trúng tuyển':
        return <Award size={14} />;
      case 'Hồ sơ hợp lệ':
        return <CheckCircle2 size={14} />;
      case 'Đang xét duyệt':
        return <Clock size={14} />;
      case 'Thiếu hồ sơ':
        return <AlertCircle size={14} />;
      case 'Đã hủy':
        return <Ban size={14} />;
      case 'Đã bị hủy':
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const isStep3Done = app.status === 'Đã trúng tuyển' || app.status === 'Hồ sơ hợp lệ';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
        boxSizing: 'border-box',
      }}
      onClick={closeApplicationDetail}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '720px' : '520px',
          height: isDesktop ? 'min(88vh, 820px)' : 'min(90dvh, calc(100dvh - 48px))',
          maxHeight: isDesktop ? '88vh' : 'calc(100dvh - 48px)',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '24px' : '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop ? '0 25px 60px rgba(0,0,0,0.35)' : '0 -10px 30px rgba(0,0,0,0.25)',
          animation: isDesktop ? 'fadeIn 0.25s ease-out' : 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isDesktop && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px', paddingBottom: '4px', backgroundColor: '#FFFFFF' }}>
            <div style={{ width: '40px', height: '4px', borderRadius: '2px', backgroundColor: '#CBD5E1' }} />
          </div>
        )}

        {/* Sticky Top Header */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            flexShrink: 0,
            gap: '10px',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
              Chi tiết hồ sơ xét tuyển
            </h3>
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
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 96px' }}>
          {/* Early Admission Celebration Certificate */}
          {app.status === 'Đã trúng tuyển' && (
            <div
              style={{
                background: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
                borderRadius: '20px',
                padding: '18px',
                color: '#FFFFFF',
                marginBottom: '16px',
                boxShadow: '0 10px 25px rgba(5, 150, 105, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={22} color="#FDE68A" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#A7F3D0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Giấy báo đủ điều kiện trúng tuyển sớm 2026
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>
                    Chúc mừng thí sinh {app.candidateName}!
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#ECFDF5', lineHeight: 1.5 }}>
                Hội đồng tuyển sinh <strong>{app.uniName} ({app.uniCode})</strong> xác nhận bạn đã đủ điều kiện trúng tuyển sớm vào ngành{' '}
                <strong>{app.major}</strong> với mức điểm xét tuyển <strong>{app.score} điểm</strong>.
              </p>
            </div>
          )}

          {/* Status & Timeline Card */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              padding: '16px',
              border: '1.5px solid #E2E8F0',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                Trạng thái hiện tại:
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: meta.color,
                  backgroundColor: meta.bg,
                  border: `1.5px solid ${meta.border}`,
                  padding: '4px 12px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {renderStatusIcon()}
                <span>{app.status}</span>
              </span>
            </div>

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
                <strong>Hồ sơ đã được thí sinh chủ động rút/hủy.</strong> Lý do: {app.cancelReason || 'Thí sinh điều chỉnh nguyện vọng'}.
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
                <strong>Hội đồng tuyển sinh từ chối hồ sơ:</strong> {app.cancelReason || app.notes || 'Chưa đạt ngưỡng đảm bảo chất lượng đầu vào.'}
              </div>
            )}

            {/* 3-Step Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    1. Đã tiếp nhận hồ sơ trực tuyến
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Thời điểm nộp: {app.submittedAt}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                {app.status === 'Thiếu hồ sơ' ? (
                  <AlertCircle size={18} color="#2563EB" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : app.status === 'Đang xét duyệt' ? (
                  <Clock size={18} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : app.status === 'Đã bị hủy' || app.status === 'Đã hủy' ? (
                  <XCircle size={18} color="#EF4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    2. Thẩm định học bạ THPT & minh chứng ưu tiên
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {app.status === 'Thiếu hồ sơ'
                      ? 'Đang chờ thí sinh bổ sung minh chứng theo ghi chú của Ban Tuyển sinh.'
                      : app.status === 'Đang xét duyệt'
                      ? `Ban Tuyển sinh ${app.uniCode} đang đối soát dữ liệu điểm và minh chứng.`
                      : app.status === 'Đã hủy' || app.status === 'Đã bị hủy'
                      ? 'Quy trình thẩm định đã dừng.'
                      : 'Đã xác thực đầy đủ điểm xét tuyển và hồ sơ minh chứng hợp lệ.'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  opacity: isStep3Done ? 1 : 0.65,
                }}
              >
                {app.status === 'Đã trúng tuyển' ? (
                  <Award size={18} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : app.status === 'Hồ sơ hợp lệ' ? (
                  <CheckCircle2 size={18} color="#0284C7" style={{ marginTop: '2px', flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={18} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
                )}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: app.status === 'Đã trúng tuyển' ? '#047857' : '#0F172A' }}>
                    3. Công bố kết quả xét tuyển sớm
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {app.status === 'Đã trúng tuyển'
                      ? 'Chính thức đủ điều kiện trúng tuyển sớm! Vui lòng xác nhận nhập học đúng hạn.'
                      : app.status === 'Hồ sơ hợp lệ'
                      ? 'Hồ sơ hợp lệ — Đang trình Hội đồng phê duyệt quyết định trúng tuyển.'
                      : 'Kết quả được cập nhật trực tiếp trên cổng thông tin UniPath 2.0.'}
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
              <div style={{ minWidth: 0 }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                  {app.uniName}
                </h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Mã trường: {app.uniCode}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: '#64748B' }}>Ngành đăng ký:</span>
                <span style={{ fontWeight: 700, color: '#2563EB', textAlign: 'right' }}>{app.major}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ color: '#64748B' }}>Điểm xét tuyển:</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{app.score} điểm</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
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
                <User size={15} color="#64748B" style={{ flexShrink: 0 }} />
                <span>Họ và tên: <strong>{app.candidateName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                <Phone size={15} color="#64748B" style={{ flexShrink: 0 }} />
                <span>Số điện thoại: <strong>{app.phone}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', wordBreak: 'break-all' }}>
                <Mail size={15} color="#64748B" style={{ flexShrink: 0 }} />
                <span>Email: <strong>{app.email}</strong></span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {app.notes && (
            <div
              style={{
                backgroundColor: app.status === 'Đã trúng tuyển' ? '#ECFDF5' : '#EFF6FF',
                borderRadius: '16px',
                padding: '14px',
                border: `1px solid ${app.status === 'Đã trúng tuyển' ? '#A7F3D0' : '#BFDBFE'}`,
                fontSize: '12.5px',
                color: app.status === 'Đã trúng tuyển' ? '#065F46' : '#1E40AF',
                lineHeight: 1.5,
                marginBottom: '16px',
              }}
            >
              <strong>Phản hồi / Ghi chú hồ sơ:</strong> {app.notes}
            </div>
          )}

          {/* STUDENT ACTION 1: SUPPLEMENT FORM WHEN STATUS === 'Thiếu hồ sơ' */}
          {isStudentOwner && app.status === 'Thiếu hồ sơ' && (
            <form
              onSubmit={handleSupplementSubmit}
              style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #93C5FD',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#1D4ED8', marginBottom: '6px' }}>
                <Upload size={17} />
                <span>Bổ sung minh chứng & Gửi xét duyệt lại</span>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '12px', color: '#334155', lineHeight: 1.45 }}>
                Chọn nhanh minh chứng đã chuẩn bị hoặc nhập nội dung giải trình để gửi lại trực tiếp cho Ban Tuyển sinh {app.uniCode}:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                {SUPPLEMENT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSupplementText(preset)}
                    style={{
                      textAlign: 'left',
                      padding: '7px 10px',
                      borderRadius: '10px',
                      border: supplementText === preset ? '1.5px solid #2563EB' : '1px solid #BFDBFE',
                      backgroundColor: supplementText === preset ? '#DBEAFE' : '#FFFFFF',
                      color: '#1E3A8A',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={supplementText}
                onChange={(e) => setSupplementText(e.target.value)}
                placeholder="Nhập ghi chú bổ sung minh chứng (link Google Drive học bạ, mã chứng chỉ IELTS/MOS...)"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: '1px solid #93C5FD',
                  padding: '9px 12px',
                  fontSize: '12.5px',
                  marginBottom: '10px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              <Button variant="primary" size="M" fullWidth type="submit" icon={<Upload size={16} />}>
                Xác nhận gửi bổ sung hồ sơ
              </Button>
            </form>
          )}

          {/* STUDENT ACTION 2: CANCEL APPLICATION (STRICTLY STUDENT OWNER ONLY!) */}
          {isStudentOwner && app.status === 'Đang xét duyệt' && (
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
                  <span>Rút / Hủy hồ sơ xét tuyển này</span>
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
                    <span>Xác nhận rút hồ sơ xét tuyển?</span>
                  </div>
                  <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#7F1D1D', lineHeight: 1.4 }}>
                    Hồ sơ đăng ký vào {app.uniName} sẽ chuyển sang trạng thái Đã hủy và dừng xét tuyển.
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
                      Đồng ý Rút hồ sơ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INSTITUTIONAL REVIEW PANEL (FOR ADMIN & PXU ADMISSIONS ONLY) */}
          {canInstitutionalReview && (
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '18px',
                padding: '16px',
                marginTop: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="#2563EB" />
                <span>Thẩm định & Quyết định của Hội đồng Tuyển sinh</span>
              </div>
              <input
                type="text"
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Nhập ghi chú phản hồi gửi tới thí sinh (không bắt buộc)..."
                style={{
                  width: '100%',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  padding: '0 12px',
                  fontSize: '12.5px',
                  marginBottom: '10px',
                  backgroundColor: '#FFFFFF',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    updateApplicationStatus(app.id, 'Hồ sơ hợp lệ', reviewerNote || undefined);
                    setReviewerNote('');
                  }}
                  style={{
                    flex: '1 1 140px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #7DD3FC',
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✓ Xác nhận hợp lệ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateApplicationStatus(app.id, 'Đã trúng tuyển', reviewerNote || undefined);
                    setReviewerNote('');
                  }}
                  style={{
                    flex: '1 1 140px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  🎓 Duyệt trúng tuyển
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateApplicationStatus(app.id, 'Thiếu hồ sơ', reviewerNote || undefined);
                    setReviewerNote('');
                  }}
                  style={{
                    flex: '1 1 140px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #93C5FD',
                    backgroundColor: '#DBEAFE',
                    color: '#1D4ED8',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📎 Yêu cầu bổ sung
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateApplicationStatus(app.id, 'Đã bị hủy', reviewerNote || undefined);
                    setReviewerNote('');
                  }}
                  style={{
                    flex: '1 1 140px',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FEE2E2',
                    color: '#B91C1C',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  ✕ Từ chối hồ sơ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 20px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <Button variant="tonal" size="L" fullWidth onClick={closeApplicationDetail}>
            Đóng chi tiết hồ sơ
          </Button>
        </div>
      </div>
    </div>
  );
};
