import React, { useState } from 'react';
import { X, Bell, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  if (!isNotificationsOpen) return null;

  const markAllAsRead = () => {
    setList((prev) => prev.map((item) => ({ ...item, read: true })));
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
      onClick={closeNotifications}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '85vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '28px 28px 0 0',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease-out',
          overflow: 'hidden',
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="#2563EB" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              Thông báo ({list.filter((i) => !i.read).length})
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllAsRead}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Đã đọc tất cả
            </button>
            <button
              onClick={closeNotifications}
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
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
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
                    <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
