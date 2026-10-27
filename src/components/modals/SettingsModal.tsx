import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  Globe,
  HelpCircle,
  Info,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/UI';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    reduceMotion,
    toggleReduceMotion,
    notifications,
    toggleNotifications,
    resetAllData,
  } = useApp();

  const [showGuide, setShowGuide] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isSettingsOpen) return null;

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
      onClick={closeSettings}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '88vh',
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
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
            Cài đặt ứng dụng
          </h3>
          <button
            onClick={closeSettings}
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

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {/* Group 1: Ứng dụng */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Tùy chọn hiển thị & Thông báo
            </span>
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              {/* Notifications Toggle */}
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={20} color="#2563EB" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                      Thông báo tuyển sinh
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Nhận thông tin cập nhật điểm chuẩn và sự kiện
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={toggleNotifications}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </div>

              {/* Reduce Motion Toggle */}
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #F1F5F9',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Sparkles size={20} color="#F59E0B" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                      Giảm hiệu ứng chuyển động
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Tối ưu tốc độ tải và tiết kiệm pin thiết bị
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={toggleReduceMotion}
                  style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#2563EB' }}
                />
              </div>

              {/* Language */}
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Globe size={20} color="#10B981" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                      Ngôn ngữ hiển thị
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>
                      Tiếng Việt (Mặc định)
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB' }}>
                  Tiếng Việt
                </span>
              </div>
            </div>
          </div>

          {/* Group 2: Hỗ trợ & Thông tin */}
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Hỗ trợ & Thông tin
            </span>
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
              <div
                onClick={() => setShowGuide(true)}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #F1F5F9',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HelpCircle size={20} color="#6366F1" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                    Hướng dẫn sử dụng Unipath
                  </span>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>

              <div
                onClick={() => setShowAbout(true)}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Info size={20} color="#0EA5E9" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                    Về Unipath & Đơn vị phát triển
                  </span>
                </div>
                <ChevronRight size={18} color="#CBD5E1" />
              </div>
            </div>
          </div>

          {/* Group 3: Dữ liệu & Đăng xuất */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button
              variant="outline"
              size="M"
              fullWidth
              style={{ borderColor: '#EF4444', color: '#EF4444' }}
              icon={<Trash2 size={16} />}
              onClick={() => setShowResetConfirm(true)}
            >
              Xóa toàn bộ dữ liệu ứng dụng
            </Button>
          </div>
        </div>

        {/* User Guide Submodal */}
        {showGuide && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                Hướng dẫn sử dụng Unipath
              </h4>
              <button
                onClick={() => setShowGuide(false)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#F1F5F9', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { title: '1. Khám phá bản thân với RIASEC', desc: 'Làm bài trắc nghiệm 12 câu để tìm ra mã tính cách và nhóm ngành tương thích nhất.' },
                { title: '2. Phân tích trúng tuyển AI Matching', desc: 'Kéo thang điểm thi THPT dự kiến và ngân sách học phí để xem danh sách trường An toàn, Vừa sức và Thách thức.' },
                { title: '3. So sánh trường và Lưu yêu thích', desc: 'Bấm biểu tượng so sánh để đối chiếu tối đa 3 trường cùng lúc trên màn hình.' },
                { title: '4. Trợ lý AI Hướng nghiệp 24/7', desc: 'Trò chuyện cùng Trợ lý AI Unipath 24/7 để được giải đáp mọi thắc mắc về điểm chuẩn, học phí và chọn trường.' },
              ].map((step, idx) => (
                <div key={idx} style={{ padding: '12px 14px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB', marginBottom: '4px' }}>{step.title}</div>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Unipath Submodal */}
        {showAbout && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <button
                onClick={() => setShowAbout(false)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#F1F5F9', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="/images/logo_unipath.png"
                alt="Unipath Logo"
                style={{ width: '64px', height: '64px', objectFit: 'contain', marginBottom: '14px' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                Hệ Sinh Thái Tuyển Sinh Unipath
              </h3>
              <span style={{ fontSize: '13px', color: '#2563EB', fontWeight: 700, marginBottom: '14px' }}>
                Phiên bản Web 2.0 (Mobile First)
              </span>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B', maxWidth: '320px', lineHeight: 1.5 }}>
                Đồng hành cùng học sinh THPT và quý phụ huynh trên hành trình chọn ngành, chọn trường và kiến tạo tương lai nghề nghiệp vững chắc.
              </p>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                © 2026 Unipath Education Platform. Bảo lưu mọi quyền.
              </div>
            </div>
          </div>
        )}

        {/* Reset All Data Confirmation Dialog */}
        {showResetConfirm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              zIndex: 1100,
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '24px',
                width: '100%',
                maxWidth: '340px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800, color: '#EF4444' }}>
                Xóa toàn bộ dữ liệu?
              </h4>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748B' }}>
                Hành động này sẽ xóa sạch danh sách yêu thích, so sánh, kết quả trắc nghiệm và lịch tư vấn trên máy này.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline"
                  size="M"
                  fullWidth
                  onClick={() => setShowResetConfirm(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  size="M"
                  fullWidth
                  onClick={() => {
                    setShowResetConfirm(false);
                    resetAllData();
                    closeSettings();
                  }}
                >
                  Xác nhận xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
