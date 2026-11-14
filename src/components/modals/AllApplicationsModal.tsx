import React, { useState } from 'react';
import {
  X,
  FileText,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  XCircle,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UniversityAvatar } from '../common/UI';
import {
  CANCELLED_STATUS_FILTER_LABEL,
  getStatusMeta,
  isCancelledStatus,
} from '../../types';
import type { ApplicationStatus } from '../../types';

export const AllApplicationsModal: React.FC = () => {
  const {
    isAllApplicationsOpen,
    closeAllApplications,
    myApplications,
    openApplicationDetail,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';
  const [activeFilter, setActiveFilter] = useState<'all' | ApplicationStatus | 'cancelled_group'>('all');

  if (!isAllApplicationsOpen) return null;

  const filteredApps = myApplications.filter((app) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'cancelled_group') return isCancelledStatus(app.status);
    return app.status === activeFilter;
  });

  const getStatusIcon = (status: ApplicationStatus) => {
    const meta = getStatusMeta(status);
    switch (status) {
      case 'Đã trúng tuyển':
        return <Award size={13} color={meta.color} />;
      case 'Hồ sơ hợp lệ':
        return <CheckCircle2 size={13} color={meta.color} />;
      case 'Đang xét duyệt':
        return <Clock size={13} color={meta.color} />;
      case 'Thiếu hồ sơ':
        return <AlertCircle size={13} color={meta.color} />;
      case 'Đã hủy':
        return <Ban size={13} color={meta.color} />;
      case 'Đã bị hủy':
        return <XCircle size={13} color={meta.color} />;
      default:
        return null;
    }
  };

  const FILTERS: { id: 'all' | ApplicationStatus | 'cancelled_group'; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'Tất cả', count: myApplications.length },
    {
      id: 'Đã trúng tuyển',
      label: 'Đã trúng tuyển',
      count: myApplications.filter((a) => a.status === 'Đã trúng tuyển').length,
      color: '#059669',
    },
    {
      id: 'Hồ sơ hợp lệ',
      label: 'Hồ sơ hợp lệ',
      count: myApplications.filter((a) => a.status === 'Hồ sơ hợp lệ').length,
      color: '#0284C7',
    },
    {
      id: 'Đang xét duyệt',
      label: 'Đang xét duyệt',
      count: myApplications.filter((a) => a.status === 'Đang xét duyệt').length,
      color: '#D97706',
    },
    {
      id: 'Thiếu hồ sơ',
      label: 'Thiếu hồ sơ',
      count: myApplications.filter((a) => a.status === 'Thiếu hồ sơ').length,
      color: '#2563EB',
    },
    {
      id: 'cancelled_group',
      label: CANCELLED_STATUS_FILTER_LABEL,
      count: myApplications.filter((a) => isCancelledStatus(a.status)).length,
      color: '#64748B',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1150,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
        boxSizing: 'border-box',
      }}
      onClick={closeAllApplications}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '760px' : '520px',
          height: isDesktop ? 'min(86vh, 800px)' : 'min(88dvh, calc(100dvh - 56px))',
          maxHeight: isDesktop ? '86vh' : 'calc(100dvh - 56px)',
          backgroundColor: '#F8FAFC',
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
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="#2563EB" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                Hồ sơ xét tuyển của tôi
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Tổng cộng: <strong>{myApplications.length}</strong> nguyện vọng cá nhân
            </span>
          </div>

          <button
            onClick={closeAllApplications}
            aria-label="Đóng danh sách hồ sơ"
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

        {/* Filter Chips Bar */}
        <div
          style={{
            padding: '10px 18px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            flexShrink: 0,
          }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '14px',
                  border: active ? `1.5px solid ${f.color || '#2563EB'}` : '1px solid #E2E8F0',
                  backgroundColor: active ? (f.color ? `${f.color}15` : '#EFF6FF') : '#F8FAFC',
                  color: active ? f.color || '#2563EB' : '#64748B',
                  fontSize: '12px',
                  fontWeight: active ? 800 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <span>{f.label}</span>
                <span
                  style={{
                    backgroundColor: active ? f.color || '#2563EB' : '#E2E8F0',
                    color: active ? '#FFFFFF' : '#475569',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '8px',
                  }}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* List of Applications */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px 40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredApps.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px dashed #CBD5E1',
                margin: '20px 0',
              }}
            >
              <FileText size={36} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 800, color: '#334155' }}>
                Không có hồ sơ nào trong mục này
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                Chưa có hồ sơ nào thuộc trạng thái đang chọn.
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const meta = getStatusMeta(app.status);
              return (
                <div
                  key={app.id}
                  onClick={() => openApplicationDetail(app)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: app.status === 'Đã trúng tuyển' ? '1.5px solid #6EE7B7' : '1.5px solid #E2E8F0',
                    padding: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: '#2563EB',
                        backgroundColor: '#EFF6FF',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        border: '1px solid #DBEAFE',
                      }}
                    >
                      {app.code}
                    </span>

                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: meta.color,
                        backgroundColor: meta.bg,
                        border: `1px solid ${meta.border}`,
                        padding: '3px 9px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {getStatusIcon(app.status)}
                      <span>{meta.label}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <UniversityAvatar code={app.uniCode} size={42} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.uniName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
                        {app.major} · <span style={{ color: '#059669' }}>{app.score}đ</span>
                      </div>
                    </div>
                  </div>

                  {app.notes && (
                    <div style={{ fontSize: '12px', color: '#475569', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', marginBottom: '10px', lineHeight: 1.4 }}>
                      {app.notes}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#94A3B8' }}>
                      Nộp lúc: {app.submittedAt}
                    </span>
                    <span style={{ color: '#2563EB', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {app.status === 'Thiếu hồ sơ' ? 'Bổ sung ngay' : 'Xem chi tiết'} <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
