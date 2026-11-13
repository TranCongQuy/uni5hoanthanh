import React, { useEffect } from 'react';
import {
  X,
  Bell,
  Calendar,
  Sparkles,
  CheckCheck,
  FileText,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { NotificationItem } from '../../types';
import { Button } from '../common/UI';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    closeNotifications,
    visibleNotifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    notifications,
    toggleNotifications,
    setActiveTab,
    user,
    viewMode,
  } = useApp();

  const isDesktop = viewMode === 'desktop';

  useEffect(() => {
    if (isNotificationsOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.documentElement.style.overflow = '';
    };
  }, [isNotificationsOpen]);

  if (!isNotificationsOpen) return null;

  const getIconMeta = (type: NotificationItem['type']) => {
    switch (type) {
      case 'application':
        return { bg: '#ECFDF5', color: '#059669', icon: <FileText size={18} /> };
      case 'booking':
        return { bg: '#EFF6FF', color: '#2563EB', icon: <Calendar size={18} /> };
      case 'quiz':
        return { bg: '#F5F3FF', color: '#7C3AED', icon: <Compass size={18} /> };
      case 'deadline':
        return { bg: '#FEF3C7', color: '#D97706', icon: <Bell size={18} /> };
      case 'system':
        return { bg: '#F1F5F9', color: '#334155', icon: <ShieldCheck size={18} /> };
      case 'promo':
      default:
        return { bg: '#FEE2E2', color: '#EF4444', icon: <Sparkles size={18} /> };
    }
  };

  const handleClickItem = (item: NotificationItem) => {
    markNotificationRead(item.id);
    if (item.targetTab !== undefined && user.role === 'student') {
      setActiveTab(item.targetTab);
      closeNotifications();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-end',
        justifyContent: 'center',
        padding: isDesktop ? '24px' : '0',
        touchAction: isDesktop ? 'auto' : 'none',
        boxSizing: 'border-box',
      }}
      onClick={closeNotifications}
    >
      <div
        style={{
          width: '100%',
          maxWidth: isDesktop ? '580px' : '520px',
          height: isDesktop ? 'min(82vh, 680px)' : 'auto',
          maxHeight: isDesktop ? '82vh' : 'min(85dvh, calc(100dvh - 56px))',
          backgroundColor: '#FFFFFF',
          borderRadius: isDesktop ? '24px' : '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isDesktop ? '0 25px 60px rgba(0,0,0,0.35)' : '0 -10px 40px rgba(0,0,0,0.25)',
          animation: isDesktop ? 'fadeIn 0.25s ease-out' : 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          touchAction: 'pan-y',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isDesktop && (
          <div
            style={{
              width: '44px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: '#CBD5E1',
              margin: '10px auto 4px',
            }}
          />
        )}

        {/* Header */}
        <div
          style={{
            padding: '12px 20px 14px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
                flexShrink: 0,
              }}
            >
              <Bell size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                Trung tâm Thông báo
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {!notifications
                  ? 'Thông báo đang tạm tắt trong Cài đặt'
                  : unreadNotificationCount > 0
                  ? `${unreadNotificationCount} thông báo chưa đọc`
                  : 'Đã xem tất cả thông báo'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {notifications && unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                style={{
                  border: 'none',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                }}
              >
                <CheckCheck size={14} /> Đọc hết
              </button>
            )}

            <button
              onClick={closeNotifications}
              aria-label="Đóng thông báo"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            padding: '16px 20px',
          }}
        >
          {!notifications ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <Bell size={36} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                Bạn đang tắt nhận thông báo
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>
                Bật lại thông báo để theo dõi kết quả xét duyệt hồ sơ và lịch tư vấn 1-1 tức thời.
              </p>
              <Button variant="primary" size="M" onClick={toggleNotifications}>
                Bật thông báo ngay
              </Button>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
              Chưa có thông báo nào dành cho bạn
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {visibleNotifications.map((item) => {
                const meta = getIconMeta(item.type);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleClickItem(item)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      backgroundColor: item.read ? '#FFFFFF' : '#EFF6FF',
                      border: item.read ? '1px solid #E2E8F0' : '1.5px solid #BFDBFE',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      boxShadow: item.read ? 'none' : '0 2px 8px rgba(37,99,235,0.08)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '11px',
                        backgroundColor: meta.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: meta.color,
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ fontSize: '13.5px', fontWeight: item.read ? 700 : 800, color: '#0F172A', lineHeight: 1.35 }}>
                          {item.title}
                        </span>
                        {!item.read && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#2563EB',
                              flexShrink: 0,
                              marginTop: '5px',
                            }}
                          />
                        )}
                      </div>
                      <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
                        {item.body}
                      </p>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF',
          }}
        >
          <Button variant="tonal" size="M" fullWidth onClick={closeNotifications}>
            Đóng thông báo
          </Button>
        </div>
      </div>
    </div>
  );
};
