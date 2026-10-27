import React, { useState, useEffect } from 'react';
import { X, Bell, Calendar, Sparkles, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'event' | 'admission' | 'system';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Khai mạc Virtual EduFair 2026',
    desc: 'Ngày hội tuyển sinh số quy tụ 30 trường Đại học chính thức mở cổng giao lưu gian hàng ảo.',
    time: '15 phút trước',
    read: false,
    type: 'event',
  },
  {
    id: 'n2',
    title: 'Học bổng OJT Đại học Phú Xuân (PXU)',
    desc: 'Công bố chính sách tài trợ 50-100% học phí dành riêng cho thí sinh khối ngành Công nghệ & Thiết kế.',
    time: '2 giờ trước',
    read: false,
    type: 'admission',
  },
  {
    id: 'n3',
    title: 'Cập nhật đề thi thử ĐGNL tháng 11',
    desc: 'Đã bổ sung 3 đề thi thử chuẩn cấu trúc ĐHQG TP.HCM vào kho tài liệu ôn luyện của bạn.',
    time: '1 ngày trước',
    read: true,
    type: 'system',
  },
];

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, closeNotifications } = useApp();
  const [list, setList] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Lock body scroll when notification modal is open on mobile
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

  const markAllAsRead = () => {
    setList((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const unreadCount = list.filter((i) => !i.read).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        touchAction: 'none',
      }}
      onClick={closeNotifications}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: 'min(85dvh, calc(100dvh - 56px))',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
          touchAction: 'pan-y',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle for Mobile */}
        <div
          style={{
            width: '44px',
            height: '5px',
            borderRadius: '3px',
            backgroundColor: '#CBD5E1',
            margin: '10px auto 4px',
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: '12px 20px 14px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                Thông báo
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Đã xem tất cả'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
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
                }}
              >
                <CheckCheck size={14} /> Đã đọc
              </button>
            )}

            {/* Clear Close Button [X] */}
            <button
              onClick={closeNotifications}
              aria-label="Đóng thông báo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content list (Contained scroll, prevents background bleed) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            padding: '16px 20px',
          }}
        >
          {list.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
              Chưa có thông báo nào
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {list.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: '16px',
                    backgroundColor: item.read ? '#FFFFFF' : '#EFF6FF',
                    border: item.read ? '1px solid #E2E8F0' : '1px solid #DBEAFE',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    boxShadow: item.read ? 'none' : '0 2px 6px rgba(37,99,235,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: item.type === 'event' ? '#FEE2E2' : '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.type === 'event' ? '#EF4444' : '#2563EB',
                      flexShrink: 0,
                    }}
                  >
                    {item.type === 'event' ? <Calendar size={18} /> : <Sparkles size={18} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', flexShrink: 0, marginLeft: '6px' }}>
                        {item.time}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Close Button for Mobile convenience */}
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
